import { act, cleanup, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeStore } from '@/lib/store';
import type { Post } from '@/lib/types/post';
import { subscribeToMockPosts } from '@/lib/mocks/mockPostEvents';
import FeedUpdatesSubscriber from './FeedUpdatesSubscriber';

vi.mock('@/lib/mocks/mockPostEvents', () => ({
  subscribeToMockPosts: vi.fn(),
}));

let emit: (post: Post) => void;
let unsubscribe: ReturnType<typeof vi.fn<() => void>>;

const makePost = (id: string): Post => ({
  id,
  title: `Post ${id}`,
  content: 'Incoming post',
  createdAt: '2026-10-30T12:00:00Z',
  author: {
    id: 'author-1',
    name: 'Test Author',
    username: 'tester',
    avatarUrl: '',
  },
});

function renderSubscriber() {
  const store = makeStore();

  const view = render(
    <Provider store={store}>
      <FeedUpdatesSubscriber />
    </Provider>,
  );

  return { store, ...view };
}

function deliver(post: Post) {
  act(() => {
    emit(post);
  });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();

  unsubscribe = vi.fn();

  vi.mocked(subscribeToMockPosts).mockImplementation((listener) => {
    emit = listener;
    return unsubscribe;
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('FeedUpdatesSubscriber highlighting', () => {
  it('expires a highlight after four seconds', () => {
    const { store } = renderSubscriber();

    deliver(makePost('live-001'));

    expect(store.getState().feed.highlightedIds['live-001']).toBe(true);

    advance(3999);

    expect(store.getState().feed.highlightedIds['live-001']).toBe(true);

    advance(1);

    expect(store.getState().feed.highlightedIds['live-001']).toBeUndefined();
  });

  it('does not restart the timer on duplicate deliveries', () => {
    const { store } = renderSubscriber();
    const post = makePost('live-001');

    deliver(post);
    advance(2000);

    deliver({ ...post, title: 'Updated content' });

    // Still only one scheduled expiry.
    expect(vi.getTimerCount()).toBe(1);

    advance(2000);

    // Expiry remains four seconds after the first event.
    expect(store.getState().feed.highlightedIds['live-001']).toBeUndefined();

    expect(store.getState().feed.feedIds).toEqual(['live-001']);

    deliver(post);

    // Duplicate delivery after expiry doesn't rehighlight.
    expect(store.getState().feed.highlightedIds['live-001']).toBeUndefined();
  });

  it('expires independent posts at different times', () => {
    const { store } = renderSubscriber();

    deliver(makePost('live-001'));
    advance(2000);

    deliver(makePost('live-002'));
    advance(2000);

    expect(store.getState().feed.highlightedIds).toEqual({ 'live-002': true });

    advance(2000);

    expect(store.getState().feed.highlightedIds).toEqual({});
  });

  it('cleans up pending timers on unmount', () => {
    const { store, unmount } = renderSubscriber();

    deliver(makePost('live-001'));

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    expect(store.getState().feed.highlightedIds).toEqual({});
  });
});
