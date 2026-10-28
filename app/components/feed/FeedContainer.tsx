'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/lib/store';
import { fetchPosts, selectFeedPosts } from '@/lib/features/feed/feedSlice';
import Feed from './Feed';

export default function FeedContainer() {
  const dispatch = useDispatch<AppDispatch>();

  const posts = useSelector(selectFeedPosts);

  const { loading, error, nextPage } = useSelector(
    (state: RootState) => state.feed,
  );

  useEffect(() => {
    if (nextPage === 1 && !loading && !error) {
      void dispatch(fetchPosts());
    }
  }, [dispatch, nextPage, loading, error]);

  const status = loading
    ? 'loading'
    : error
      ? 'failed'
      : nextPage === 1
        ? 'idle'
        : 'succeeded';

  return (
    <div className="mx-auto w-full px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Feed</h1>

      <Feed
        posts={posts}
        status={status}
        error={error}
        onRetry={() => void dispatch(fetchPosts())}
      />
    </div>
  );
}
