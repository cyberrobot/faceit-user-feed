'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/lib/store';
import { fetchPosts, selectFeedPosts } from '@/lib/features/feed/feedSlice';
import Feed from './Feed';

export default function FeedContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const posts = useSelector(selectFeedPosts);

  const { loading, error, nextPage, hasMore } = useSelector(
    (state: RootState) => state.feed,
  );

  useEffect(() => {
    // Load only the first page on mount; after a failure, let the retry button own the next attempt.
    if (nextPage === 1 && !loading && !error) {
      void dispatch(fetchPosts());
    }
  }, [dispatch, nextPage, loading, error]);

  // Load subsequent pages when the sentinel enters the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || posts.length === 0 || !hasMore || loading || error) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void dispatch(fetchPosts());
        }
      },
      {
        rootMargin: '300px 0px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [dispatch, posts.length, hasMore, loading, error]);

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

      <Feed posts={posts} status={status} error={error} />
      <div
        ref={sentinelRef}
        data-testid="feed-sentinel"
        className="h-px"
        aria-hidden="true"
      />
    </div>
  );
}
