import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/lib/store';
import { fetchPosts, selectFeedPosts } from './feedSlice';
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
});
