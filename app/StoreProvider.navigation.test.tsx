import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSelector } from 'react-redux';

import StoreProvider from './StoreProvider';
import FeedContainer from './components/feed/FeedContainer';
import { mockLivePosts } from '@/lib/data/mockLivePosts';
import { subscribeToMockPosts } from '@/lib/mocks/mockPostEvents';
import type { RootState } from '@/lib/store';
import type { Post } from '@/lib/types/post';
import { ImageProps } from 'next/image';

// Match the image mock used in existing feed tests.
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: ImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      src={
        typeof src === 'string' ? src : 'src' in src ? src.src : src.default.src
      }
    />
  ),
}));

// Spy on the subscription while keeping the real timer
// implementation. Wrap cleanup so it can be asserted.
vi.mock('@/lib/mocks/mockPostEvents', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/lib/mocks/mockPostEvents')>();

  return {
    subscribeToMockPosts: vi.fn(
      (...args: Parameters<typeof actual.subscribeToMockPosts>) => {
        const unsubscribe = actual.subscribeToMockPosts(...args);

        return vi.fn(unsubscribe);
      },
    ),
  };
});

const originalPost: Post = {
  ...mockLivePosts[0],
  id: 'post-original',
  title: 'Original feed post',
};

const fetchMock = vi.fn(async () => {
  return {
    ok: true,
    json: async () => ({
      posts: [originalPost],
      page: 1,
      pageSize: 20,
      total: 1,
    }),
  } as Response;
});

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Displays the shared Redux count while details are open.
function DetailRoute() {
  const count = useSelector((state: RootState) => state.feed.feedIds.length);

  return (
    <main>
      <h1>Post details</h1>
      <output data-testid="cached-post-count">{count}</output>
    </main>
  );
}

type Route = 'feed' | 'details';

// Keep StoreProvider at the same tree position when
// switching route content, like the root App Router layout.
function renderNavigation(initialRoute: Route = 'feed') {
  const content = (route: Route) =>
    route === 'feed' ? <FeedContainer /> : <DetailRoute />;

  const view = render(<StoreProvider>{content(initialRoute)}</StoreProvider>);

  return {
    ...view,
    navigate(route: Route) {
      view.rerender(<StoreProvider>{content(route)}</StoreProvider>);
    },
  };
}

async function flushInitialFetch() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function advanceEvents(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function renderedPostTitles() {
  return screen
    .getAllByRole('article')
    .map((article) => article.querySelector('h2')?.textContent);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('real-time feed navigation', () => {
  it('receives posts on details and shows them after returning to the feed', async () => {
    const { navigate } = renderNavigation('feed');

    await flushInitialFetch();

    expect(screen.getByText('Original feed post')).toBeTruthy();

    expect(subscribeToMockPosts).toHaveBeenCalledTimes(1);

    // Navigate away from the feed.
    navigate('details');

    expect(screen.getByText('Post details')).toBeTruthy();

    // The original post remains in Redux.
    expect(screen.getByTestId('cached-post-count').textContent).toBe('1');

    // A new post arrives while viewing details.
    advanceEvents(10_000);

    expect(screen.getByTestId('cached-post-count').textContent).toBe('2');

    // The subscription has not been recreated.
    expect(subscribeToMockPosts).toHaveBeenCalledTimes(1);

    // Navigate back.
    navigate('feed');

    expect(renderedPostTitles()).toEqual([
      mockLivePosts[0].title,
      'Original feed post',
    ]);

    // No redundant page-one request.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves multiple posts received before the feed is first opened', async () => {
    // Simulate opening a direct detail URL first.
    const { navigate } = renderNavigation('details');

    expect(subscribeToMockPosts).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('cached-post-count').textContent).toBe('0');

    // Receive two posts on the details route.
    advanceEvents(20_000);

    expect(screen.getByTestId('cached-post-count').textContent).toBe('2');

    // Open the feed for the first time.
    navigate('feed');

    await flushInitialFetch();

    expect(renderedPostTitles()).toEqual([
      mockLivePosts[1].title,
      mockLivePosts[0].title,
      'Original feed post',
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(subscribeToMockPosts).toHaveBeenCalledTimes(1);
  });

  it('does not unsubscribe during navigation but cleans up on provider unmount', () => {
    const { navigate, unmount } = renderNavigation('details');

    const subscription = vi.mocked(subscribeToMockPosts);

    expect(subscription).toHaveBeenCalledTimes(1);

    const unsubscribe = subscription.mock.results[0].value;

    navigate('feed');
    navigate('details');
    navigate('feed');

    // Route changes must not stop or restart the stream.
    expect(subscription).toHaveBeenCalledTimes(1);
    expect(unsubscribe).not.toHaveBeenCalled();

    unmount();

    // The subscription is cleaned up exactly once.
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
