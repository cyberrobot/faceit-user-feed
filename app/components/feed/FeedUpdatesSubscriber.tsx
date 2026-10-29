'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/lib/store';
import { postReceived } from '@/lib/features/feed/feedSlice';
import { subscribeToMockPosts } from '@/lib/mocks/mockPostEvents';

export default function FeedUpdatesSubscriber() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return subscribeToMockPosts((post) => {
      dispatch(postReceived(post));
    });
  }, [dispatch]);

  return null;
}
