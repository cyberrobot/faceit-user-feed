'use client';

import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';

import type { AppDispatch, RootState } from '@/lib/store';
import {
  postHighlightExpired,
  postReceived,
} from '@/lib/features/feed/feedSlice';
import { subscribeToMockPosts } from '@/lib/mocks/mockPostEvents';

export default function FeedUpdatesSubscriber() {
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();

  useEffect(() => {
    const timers = new Map<string, number>();

    const unsubscribe = subscribeToMockPosts((post) => {
      const isNew = !store.getState().feed.postsById[post.id];

      dispatch(postReceived(post));

      // Duplicates should not restart highlighting.
      if (!isNew) return;

      const timer = window.setTimeout(() => {
        dispatch(postHighlightExpired(post.id));
        timers.delete(post.id);
      }, HIGHLIGHT_DURATION_MS);

      timers.set(post.id, timer);
    });

    return () => {
      unsubscribe();

      // Prevent pending callbacks after unmount.
      for (const [id, timer] of timers) {
        window.clearTimeout(timer);
        dispatch(postHighlightExpired(id));
      }

      timers.clear();
    };
  }, [dispatch, store]);

  return null;
}

export const HIGHLIGHT_DURATION_MS = 4_000;
