'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import type { AppDispatch, RootState } from '@/lib/store';
import {
  clearFeedScrollBookmark,
  fetchPosts,
  saveFeedScrollBookmark,
  selectFeedPosts,
} from '@/lib/features/feed/feedSlice';
import Feed from './Feed';

export default function FeedContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const posts = useSelector(selectFeedPosts);
  const loading = useSelector((state: RootState) => state.feed.loading);
  const error = useSelector((state: RootState) => state.feed.error);
  const nextPage = useSelector((state: RootState) => state.feed.nextPage);
  const hasMore = useSelector((state: RootState) => state.feed.hasMore);
  const highlightedIds = useSelector(
    (state: RootState) => state.feed.highlightedIds,
  );

  const handleOpenPost = (postId: string, viewportTop: number) => {
    // Save the scroll position and post ID to the Redux store before navigating away.
    dispatch(
      saveFeedScrollBookmark({
        postId,
        viewportTop,
        scrollY: window.scrollY,
      }),
    );
  };

  useLayoutEffect(() => {
    // Restore the scroll position if a bookmark exists.
    const bookmark = store.getState().feed.scrollBookmark;
    if (!bookmark) {
      return;
    }

    const { postId, viewportTop, scrollY } = bookmark;

    const article = document.getElementById(`feed-post-${postId}`);

    const targetY = article
      ? window.scrollY + article.getBoundingClientRect().top - viewportTop
      : scrollY;

    window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });

    dispatch(clearFeedScrollBookmark());
  }, [dispatch, store]);

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

      <Feed
        posts={posts}
        status={status}
        error={error}
        highlightedIds={highlightedIds}
        onOpenPost={handleOpenPost}
      />
      <div
        ref={sentinelRef}
        data-testid="feed-sentinel"
        className="h-px"
        aria-hidden="true"
      />
    </div>
  );
}
