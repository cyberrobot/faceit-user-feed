import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/lib/store';
import { fetchPosts } from './feedSlice';
import type { Post } from '@/lib/types/post';

const makePost = (id: string): Post => ({
  id,
  author: {
    id: 'author-1',
    name: 'Avery Green',
    username: 'avery',
    avatarUrl: '/avatar.png',
  },
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
});
