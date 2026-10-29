import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';
import { RetryButton } from './RetryButton';

// Render the button with Redux context.
function renderRetryButton() {
  const store = makeStore();

  render(
    <Provider store={store}>
      <RetryButton />
    </Provider>,
  );

  return store;
}

// Mock successful API response.
const successfulResponse = () =>
  ({
    ok: true,
    json: async () => ({
      posts: [],
      page: 1,
      pageSize: 20,
      total: 0,
    }),
  }) as Response;

// Clean up after each test.
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RetryButton', () => {
  it('renders the retry button', () => {
    renderRetryButton();

    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('dispatches fetchPosts when clicked', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(successfulResponse());

    vi.stubGlobal('fetch', fetchMock);

    const store = renderRetryButton();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => {
      expect(store.getState().feed.loading).toBe(false);
      expect(store.getState().feed.nextPage).toBe(2);
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe('/api/posts?page=1');
  });

  it('prevents overlapping requests', async () => {
    const user = userEvent.setup();

    let resolveRequest!: (response: Response) => void;

    const pendingRequest = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });

    const fetchMock = vi.fn().mockReturnValue(pendingRequest);

    vi.stubGlobal('fetch', fetchMock);

    const store = renderRetryButton();
    const button = screen.getByRole('button', { name: 'Try again' });

    await user.click(button);
    await user.click(button);

    // fetchPosts.condition prevents concurrent requests.
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(store.getState().feed.loading).toBe(true);

    await act(async () => {
      resolveRequest(successfulResponse());
    });

    expect(store.getState().feed.loading).toBe(false);
  });

  it('retries the same page after a failed request', async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ error: 'Service unavailable' }),
      })
      .mockResolvedValueOnce(successfulResponse());

    vi.stubGlobal('fetch', fetchMock);

    const store = renderRetryButton();
    const button = screen.getByRole('button', { name: 'Try again' });

    // First attempt fails.
    await user.click(button);

    await waitFor(() => {
      expect(store.getState().feed.error).toBe('Service unavailable');
    });

    expect(store.getState().feed.nextPage).toBe(1);

    // Retry the failed page.
    await user.click(button);

    await waitFor(() => {
      expect(store.getState().feed).toMatchObject({
        loading: false,
        error: null,
        nextPage: 2,
      });
    });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/posts?page=1',
      '/api/posts?page=1',
    ]);
  });
});
