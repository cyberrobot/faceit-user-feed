import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { makeStore } from '@/lib/store';
import type { Post } from '@/lib/types/post';
import FeedContainer from './FeedContainer';
import { FEED_PAGE_SIZE } from '@/app/config/feed';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src.src} alt={alt} />
  ),
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
});
