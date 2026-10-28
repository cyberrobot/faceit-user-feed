import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { makeStore } from '@/lib/store';
import type { Post } from '@/lib/types/post';
import FeedContainer from './FeedContainer';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src.src} alt={alt} />
  ),
}));

const posts: Post[] = Array.from({ length: 20 }, (_, index) => ({
  id: `post-${index + 1}`,
  author: {
    id: `user-${index + 1}`,
    name: `Author ${index + 1}`,
    username: `author${index + 1}`,
    avatarUrl: '',
  },
  content: `Post content ${index + 1}`,
  createdAt: '2026-10-28T14:30:00Z',
}));

function successfulResponse() {
  return {
    ok: true,
    json: async () => ({
      posts,
      page: 1,
      pageSize: 20,
      total: 40,
    }),
  };
}

function renderContainer() {
  const store = makeStore();

  render(
    <Provider store={store}>
      <FeedContainer />
    </Provider>,
  );

  return store;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('FeedContainer', () => {
  it('fetches the first page on mount', async () => {
    const fetchMock = vi.fn().mockResolvedValue(successfulResponse());

    vi.stubGlobal('fetch', fetchMock);

    const store = renderContainer();

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
});
