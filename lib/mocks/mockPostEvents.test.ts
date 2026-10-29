import { afterEach, expect, it, vi } from 'vitest';
import { subscribeToMockPosts } from './mockPostEvents';
import { mockLivePosts } from '@/lib/data/mockLivePosts';

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

it('emits posts at the configured interval', () => {
  vi.useFakeTimers();

  const listener = vi.fn();
  const unsubscribe = subscribeToMockPosts(listener, 1000);

  vi.advanceTimersByTime(1000);

  expect(listener).toHaveBeenCalledWith(mockLivePosts[0]);

  unsubscribe();
});

it('stops emitting after unsubscribing', () => {
  vi.useFakeTimers();

  const listener = vi.fn();
  const unsubscribe = subscribeToMockPosts(listener, 1000);

  unsubscribe();

  vi.advanceTimersByTime(5000);

  expect(listener).not.toHaveBeenCalled();
});
