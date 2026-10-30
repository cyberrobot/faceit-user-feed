import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { makeStore } from '@/lib/store';
import type { Post } from '@/lib/types/post';
import FeedContainer from './FeedContainer';
import { FEED_PAGE_SIZE } from '@/app/config/feed';
import { postReceived } from '@/lib/features/feed/feedSlice';
import { ImageProps } from 'next/image';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    unoptimized: _unoptimized,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    ...props
  }: ImageProps) => {
    void _unoptimized;
    void _placeholder;
    void _blurDataURL;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={alt}
        src={
          typeof src === 'string'
            ? src
            : 'src' in src
              ? src.src
              : src.default.src
        }
      />
    );
  },
}));

// Controllable IntersectionObserver mock.
const observers: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(
    private callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    observers.push(this);
  }

  trigger(isIntersecting = true) {
    const target = this.observe.mock.calls[0]?.[0];

    if (!target) {
      throw new Error('Observer has no target.');
    }

    this.callback(
      [{ isIntersecting, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

// Access the latest registered observer.
function getObserver() {
  const observer = observers.at(-1);

  if (!observer) {
    throw new Error('No IntersectionObserver registered.');
  }

  return observer;
}

// Generate posts for any page.
function makePosts(page: number): Post[] {
  return Array.from({ length: FEED_PAGE_SIZE }, (_, index) => {
    const number = (page - 1) * FEED_PAGE_SIZE + index + 1;

    return {
      id: `post-${number}`,
      author: {
        id: `user-${number}`,
        name: `Author ${number}`,
        username: `author${number}`,
        avatarUrl: '',
      },
      title: `Post Title ${number}`,
      content: `Post content ${number}`,
      createdAt: '2026-10-28T14:30:00Z',
    };
  });
}

function successfulResponse(page = 1) {
  return {
    ok: true,
    json: async () => ({
      posts: makePosts(page),
      page,
      pageSize: FEED_PAGE_SIZE,
      total: 40,
    }),
  } as Response;
}

function renderContainer() {
  const store = makeStore();

  const view = render(
    <Provider store={store}>
      <FeedContainer />
    </Provider>,
  );

  return { store, ...view };
}

// Register observer mock before every test.
beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

// Clean up observer and fetch mocks.
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('FeedContainer', () => {
  it('fetches the first page on mount', async () => {
    const fetchMock = vi.fn().mockResolvedValue(successfulResponse());

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/posts?page=1');

    expect(store.getState().feed.feedIds).toHaveLength(20);
    expect(store.getState().feed.nextPage).toBe(2);
  });

  it('displays an error and retries successfully', async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({
          error: 'Service unavailable',
        }),
      })
      .mockResolvedValueOnce(successfulResponse());

    vi.stubGlobal('fetch', fetchMock);

    renderContainer();

    expect(await screen.findByText('Service unavailable')).toBeTruthy();

    // A failed request should not trigger endless retries.
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('loads page 2 and stops after all 40 posts', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successfulResponse(1))
      .mockResolvedValueOnce(successfulResponse(2));

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    expect(getObserver().observe).toHaveBeenCalledOnce();
    expect(getObserver().options?.rootMargin).toBe('300px 0px');

    // Simulate the sentinel entering the viewport.
    act(() => {
      getObserver().trigger();
    });

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(40);
    });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
    ]);

    expect(store.getState().feed.hasMore).toBe(false);
    expect(store.getState().feed.feedIds).toHaveLength(40);
    expect(new Set(store.getState().feed.feedIds).size).toBe(40);

    // The observer must disconnect after the final page.
    expect(getObserver().disconnect).toHaveBeenCalled();

    // Even a stale callback must not start page 3.
    act(() => {
      getObserver().trigger();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('ignores repeated observer callbacks while loading', async () => {
    let resolvePageTwo!: (response: Response) => void;

    const pendingPageTwo = new Promise<Response>((resolve) => {
      resolvePageTwo = resolve;
    });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successfulResponse(1))
      .mockReturnValueOnce(pendingPageTwo);

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    const observer = getObserver();

    // Simulate multiple callbacks before the request completes.
    act(() => {
      observer.trigger();
      observer.trigger();
      observer.trigger();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(store.getState().feed.loading).toBe(true);
    expect(screen.getAllByRole('article')).toHaveLength(20);

    // Complete the pending second-page request.
    await act(async () => {
      resolvePageTwo(successfulResponse(2));
    });

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(40);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries a failed second page without skipping it', async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successfulResponse(1))
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ error: 'Service unavailable' }),
      })
      .mockResolvedValueOnce(successfulResponse(2));

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    act(() => {
      getObserver().trigger();
    });

    expect(await screen.findByText('Service unavailable')).toBeTruthy();

    // Existing posts remain visible.
    expect(screen.getAllByRole('article')).toHaveLength(20);

    // The failed request must not advance the page.
    expect(store.getState().feed.nextPage).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(40);
    });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
      '/api/posts?page=2',
    ]);

    expect(store.getState().feed.nextPage).toBe(3);
    expect(store.getState().feed.hasMore).toBe(false);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('disconnects the observer on unmount', async () => {
    const fetchMock = vi.fn().mockResolvedValue(successfulResponse(1));

    vi.stubGlobal('fetch', fetchMock);

    const { unmount } = renderContainer();

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    const observer = getObserver();

    expect(observer.observe).toHaveBeenCalledOnce();

    unmount();

    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it('renders duplicate live events only once and preserves pagination', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successfulResponse(1))
      .mockResolvedValueOnce(successfulResponse(2));

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    // Load the initial 20 posts.
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(store.getState().feed.nextPage).toBe(2);

    // Simulate an incoming live post.
    const livePost: Post = {
      ...makePosts(1)[0],
      id: 'live-001',
      title: 'New live post',
      content: 'Content from a live event',
    };

    // Dispatch the same event twice.
    act(() => {
      store.dispatch(postReceived(livePost));
      store.dispatch(postReceived(livePost));
    });

    // Exactly one new card should be rendered.
    expect(screen.getAllByRole('article')).toHaveLength(21);

    expect(
      screen.getAllByRole('heading', {
        name: 'New live post',
      }),
    ).toHaveLength(1);

    // Live post must appear at the top.
    expect(
      screen.getAllByRole('article')[0].querySelector('h2')?.textContent,
    ).toBe('New live post');

    // Pagination must not advance because of live events.
    expect(store.getState().feed.nextPage).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Trigger the next page.
    act(() => {
      getObserver().trigger();
    });

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(41);
    });

    // Verify deduplication and ordering.
    const state = store.getState().feed;

    expect(state.feedIds).toHaveLength(41);
    expect(new Set(state.feedIds).size).toBe(41);
    expect(state.feedIds[0]).toBe('live-001');

    // Pagination should complete normally.
    expect(state.nextPage).toBe(3);
    expect(state.hasMore).toBe(false);

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
    ]);
  });

  it('preserves live posts received during pagination without duplicates', async () => {
    let resolvePageTwo!: (response: Response) => void;

    // Keep the second page request pending.
    const pendingPageTwo = new Promise<Response>((resolve) => {
      resolvePageTwo = resolve;
    });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(successfulResponse(1))
      .mockReturnValueOnce(pendingPageTwo);

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    // Load the initial 20 posts.
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    expect(store.getState().feed.nextPage).toBe(2);

    // Trigger page 2, but leave its request unresolved.
    act(() => {
      getObserver().trigger();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(store.getState().feed.loading).toBe(true);
    expect(store.getState().feed.nextPage).toBe(2);

    // The existing posts remain visible while loading.
    expect(screen.getAllByRole('article')).toHaveLength(20);

    // Receive a live post while page 2 is pending.
    const livePost: Post = {
      ...makePosts(2)[0],
      id: 'live-001',
      title: 'Live post during pagination',
      content: 'New content received while loading.',
    };

    act(() => {
      store.dispatch(postReceived(livePost));
    });

    // The live post appears immediately.
    expect(screen.getAllByRole('article')).toHaveLength(21);

    expect(
      screen.getAllByRole('article')[0].querySelector('h2')?.textContent,
    ).toBe(livePost.title);

    // The incoming event must not change pagination.
    expect(store.getState().feed.nextPage).toBe(2);
    expect(store.getState().feed.loading).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Resolve page 2.
    // Deliberately include the same live post in the response.
    const pageTwoPosts = [livePost, ...makePosts(2).slice(1)];

    await act(async () => {
      resolvePageTwo({
        ok: true,
        json: async () => ({
          posts: pageTwoPosts,
          page: 2,
          pageSize: FEED_PAGE_SIZE,
          total: 40,
        }),
      } as Response);
    });

    // Verify the final rendered feed.
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(40);
    });

    const articles = screen.getAllByRole('article');

    // The live post remains at the top.
    expect(articles[0].querySelector('h2')?.textContent).toBe(livePost.title);

    // It must only appear once.
    expect(
      screen.getAllByRole('heading', {
        name: livePost.title,
      }),
    ).toHaveLength(1);

    // Verify Redux state and pagination.
    const state = store.getState().feed;

    expect(state.feedIds).toHaveLength(40);
    expect(new Set(state.feedIds).size).toBe(40);
    expect(state.feedIds[0]).toBe('live-001');

    expect(state.nextPage).toBe(3);
    expect(state.hasMore).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();

    // Exactly two API requests, in the correct order.
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
    ]);
  });

  it('displays an empty state and stops pagination when no posts exist', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [],
        page: 1,
        pageSize: FEED_PAGE_SIZE,
        total: 0,
      }),
    } as Response);

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    // Wait for the initial request to complete.
    await waitFor(() => {
      expect(screen.getByText('No posts available.')).toBeTruthy();
    });

    // No post cards should be rendered.
    expect(screen.queryAllByRole('article')).toHaveLength(0);

    // Loading and error states should not be visible.
    expect(screen.queryByRole('status', { name: 'Loading posts' })).toBeNull();

    expect(screen.queryByRole('alert')).toBeNull();

    // Pagination must terminate.
    expect(store.getState().feed).toMatchObject({
      feedIds: [],
      nextPage: 2,
      hasMore: false,
      loading: false,
      error: null,
    });

    // No observer should be created for an empty feed.
    expect(observers).toHaveLength(0);

    // Only the initial page should be requested.
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
    ]);
  });

  it('renders a partial final page and stops pagination', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          posts: makePosts(1),
          page: 1,
          pageSize: FEED_PAGE_SIZE,
          total: 25,
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          posts: makePosts(2).slice(0, 5),
          page: 2,
          pageSize: FEED_PAGE_SIZE,
          total: 25,
        }),
      } as Response);

    vi.stubGlobal('fetch', fetchMock);

    const { store } = renderContainer();

    // 1. Initial page contains 20 posts.
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    expect(store.getState().feed).toMatchObject({
      nextPage: 2,
      hasMore: true,
    });

    // 2. Trigger loading of the next page.
    const observer = getObserver();

    act(() => {
      observer.trigger();
    });

    // 3. Only five additional posts should be loaded.
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(25);
    });

    // Verify the final post is rendered.
    expect(
      screen.getByRole('heading', {
        name: 'Post Title 25',
      }),
    ).toBeTruthy();

    // Verify pagination has terminated.
    const state = store.getState().feed;

    expect(state.feedIds).toHaveLength(25);
    expect(new Set(state.feedIds).size).toBe(25);

    expect(state.nextPage).toBe(3);
    expect(state.hasMore).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();

    // Observer should be disconnected.
    expect(observer.disconnect).toHaveBeenCalled();

    // Even a stale observer callback must not fetch page 3.
    act(() => {
      observer.trigger();
    });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
