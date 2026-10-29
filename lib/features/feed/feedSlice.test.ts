import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/lib/store';
import { fetchPosts, postReceived, selectFeedPosts } from './feedSlice';
import type { Post } from '@/lib/types/post';

const makePost = (id: string): Post => ({
  id,
  author: {
    id: 'author-1',
    name: 'Avery Green',
    username: 'avery',
    avatarUrl: '/avatar.png',
  },
  title: `Sample post title`,
  content: `Post ${id}`,
  createdAt: '2026-10-28T09:00:00.000Z',
});

const jsonResponse = (body: unknown) =>
  ({
    ok: true,
    json: async () => body,
  }) as Response;

describe('feed state', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('tracks loading and errors, and ignores duplicate requests while loading', async () => {
    let resolveFirstRequest!: (response: Response) => void;

    const fetchMock = vi.fn<typeof fetch>(
      () =>
        new Promise<Response>((resolve) => {
          resolveFirstRequest = resolve;
        }),
    );

    vi.stubGlobal('fetch', fetchMock);
    const store = makeStore();

    const firstRequest = store.dispatch(fetchPosts());

    expect(store.getState().feed.loading).toBe(true);

    await store.dispatch(fetchPosts());
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFirstRequest(
      jsonResponse({
        posts: [makePost('one')],
        page: 1,
        pageSize: 1,
        total: 2,
      }),
    );

    await firstRequest;

    expect(store.getState().feed).toMatchObject({
      loading: false,
      error: null,
      nextPage: 2,
      hasMore: true,
      feedIds: ['one'],
    });

    fetchMock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          status: 503,
          json: async () => ({ error: 'Temporarily unavailable.' }),
        }) as Response,
    );

    await store.dispatch(fetchPosts());

    expect(store.getState().feed).toMatchObject({
      loading: false,
      error: 'Temporarily unavailable.',
      nextPage: 2,
      hasMore: true,
    });
  });

  it('merges overlapping pages without duplicate IDs and stops at the last page', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse({
          posts: [makePost('one'), makePost('two')],
          page: 1,
          pageSize: 2,
          total: 3,
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          posts: [makePost('two'), makePost('three')],
          page: 2,
          pageSize: 2,
          total: 3,
        }),
      );

    vi.stubGlobal('fetch', fetchMock);
    const store = makeStore();

    await store.dispatch(fetchPosts());
    await store.dispatch(fetchPosts());

    expect(store.getState().feed).toMatchObject({
      feedIds: ['one', 'two', 'three'],
      nextPage: 3,
      loading: false,
      hasMore: false,
      error: null,
    });

    expect(store.getState().feed.postsById.two).toEqual(makePost('two'));
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
    ]);

    await store.dispatch(fetchPosts());
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns the same reference when feed data is unchanged', () => {
    const store = makeStore();
    const state = store.getState();

    const firstResult = selectFeedPosts(state);
    const secondResult = selectFeedPosts({
      ...state,
    });

    expect(secondResult).toBe(firstResult);
  });

  it('retries the failed page and advances only after success', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      // Page 1 succeeds.
      .mockResolvedValueOnce(
        jsonResponse({
          posts: [makePost('one')],
          page: 1,
          pageSize: 1,
          total: 2,
        }),
      )
      // Page 2 initially fails.
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ error: 'Service unavailable' }),
      } as Response)
      // Retrying page 2 succeeds.
      .mockResolvedValueOnce(
        jsonResponse({
          posts: [makePost('two')],
          page: 2,
          pageSize: 1,
          total: 2,
        }),
      );

    vi.stubGlobal('fetch', fetchMock);

    const store = makeStore();

    // Fetch page 1.
    await store.dispatch(fetchPosts());

    expect(store.getState().feed.nextPage).toBe(2);
    expect(store.getState().feed.feedIds).toEqual(['one']);

    // Fetch page 2, which fails.
    await store.dispatch(fetchPosts());

    expect(store.getState().feed).toMatchObject({
      nextPage: 2,
      loading: false,
      error: 'Service unavailable',
      hasMore: true,
      feedIds: ['one'],
    });

    // Retry must request page 2 again.
    await store.dispatch(fetchPosts());

    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
      '/api/posts?page=2',
    ]);

    expect(store.getState().feed).toMatchObject({
      nextPage: 3,
      loading: false,
      error: null,
      hasMore: false,
      feedIds: ['one', 'two'],
    });
  });

  it('prepends incoming posts and deduplicates IDs', () => {
    const store = makeStore();
    const incoming = makePost('live-001');

    store.dispatch(postReceived(incoming));
    store.dispatch(postReceived(incoming));

    expect(store.getState().feed.feedIds).toEqual(['live-001']);

    expect(store.getState().feed.postsById['live-001']).toEqual(incoming);

    expect(store.getState().feed.nextPage).toBe(1);
    expect(store.getState().feed.hasMore).toBe(true);
  });

  it('preserves page progression after incoming posts', () => {
    const store = makeStore();

    const pageOne = [makePost('post-001'), makePost('post-002')];

    store.dispatch(
      fetchPosts.fulfilled(
        {
          posts: pageOne,
          page: 1,
          pageSize: 2,
          total: 4,
        },
        'request-1',
        undefined,
      ),
    );

    store.dispatch(postReceived(makePost('live-001')));

    expect(store.getState().feed.feedIds).toEqual([
      'live-001',
      'post-001',
      'post-002',
    ]);

    expect(store.getState().feed.nextPage).toBe(2);
    expect(store.getState().feed.hasMore).toBe(true);

    store.dispatch(
      fetchPosts.fulfilled(
        {
          posts: [makePost('post-002'), makePost('post-003')],
          page: 2,
          pageSize: 2,
          total: 4,
        },
        'request-2',
        undefined,
      ),
    );

    expect(store.getState().feed.feedIds).toEqual([
      'live-001',
      'post-001',
      'post-002',
      'post-003',
    ]);

    expect(store.getState().feed.nextPage).toBe(3);
    expect(store.getState().feed.hasMore).toBe(false);
  });

  it('preserves incoming posts while page 2 is loading', async () => {
    let resolvePageTwo!: (response: Response) => void;

    // Keep page 2 pending until explicitly resolved.
    const pendingPageTwo = new Promise<Response>((resolve) => {
      resolvePageTwo = resolve;
    });

    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse({
          posts: [makePost('post-001'), makePost('post-002')],
          page: 1,
          pageSize: 2,
          total: 4,
        }),
      )
      .mockReturnValueOnce(pendingPageTwo);

    vi.stubGlobal('fetch', fetchMock);

    const store = makeStore();

    // 1. Load the first page.
    await store.dispatch(fetchPosts());

    expect(store.getState().feed.feedIds).toEqual(['post-001', 'post-002']);

    expect(store.getState().feed.nextPage).toBe(2);

    // 2. Begin fetching page 2 without awaiting it.
    const pageTwoRequest = store.dispatch(fetchPosts());

    expect(store.getState().feed.loading).toBe(true);

    // 3. Receive a live post while page 2 is pending.
    const livePost = makePost('live-001');

    store.dispatch(postReceived(livePost));

    expect(store.getState().feed.feedIds).toEqual([
      'live-001',
      'post-001',
      'post-002',
    ]);

    // Pagination must remain unchanged during the event.
    expect(store.getState().feed.nextPage).toBe(2);
    expect(store.getState().feed.loading).toBe(true);

    // 4. Complete the page 2 request.
    resolvePageTwo(
      jsonResponse({
        posts: [makePost('post-003'), makePost('post-004')],
        page: 2,
        pageSize: 2,
        total: 4,
      }),
    );

    await pageTwoRequest;

    // 5. Verify the final Redux state.
    const state = store.getState().feed;

    expect(state.feedIds).toEqual([
      'live-001',
      'post-001',
      'post-002',
      'post-003',
      'post-004',
    ]);

    // Live post remains accessible.
    expect(state.postsById['live-001']).toEqual(livePost);

    // No duplicate IDs.
    expect(new Set(state.feedIds).size).toBe(5);

    // Pagination advances normally.
    expect(state.nextPage).toBe(3);
    expect(state.hasMore).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();

    // Only the two expected API requests.
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=2',
    ]);
  });
});
