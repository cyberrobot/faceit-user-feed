import { Post } from '@/lib/types/post';
import PostCard from './PostCard';
import { FEED_PAGE_SIZE } from '@/app/config/feed';
import PostSkeletonCard from './PostCardSkeleton';
import { RetryButton } from './RetryButton';

export type FeedStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface FeedProps {
  posts: Post[];
  status: FeedStatus;
  error?: string | null;
  highlightedIds?: Record<string, true>;
  onOpenPost?: (postId: string, viewportTop: number) => void;
}

const Feed = ({
  posts,
  status,
  error,
  highlightedIds = {},
  onOpenPost,
}: FeedProps) => {
  const hasPosts = posts.length > 0;
  const isLoading = status === 'loading';
  const isFailed = status === 'failed';

  if (!hasPosts && (status === 'idle' || isLoading)) {
    return (
      <section role="status" aria-label="Loading posts">
        <ul className="space-y-4">
          {Array.from({ length: FEED_PAGE_SIZE }).map((_, index) => (
            <li key={index}>
              <PostSkeletonCard />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (!hasPosts && isFailed) {
    return (
      <div role="alert" className="rounded-lg border p-6 text-center">
        <p className="text-gray-700 dark:text-gray-200">
          {error || 'Unable to load posts. Please try again.'}
        </p>

        <RetryButton />
      </div>
    );
  }

  if (!hasPosts) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-gray-500 dark:text-gray-300">No posts available.</p>
      </div>
    );
  }

  return (
    <section aria-label="Posts feed" aria-busy={isLoading}>
      <ul className="space-y-4">
        {/* Feed render the posts supplied by Redux. The API controls page size. */}
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              isHighlighted={Boolean(highlightedIds[post.id])}
              onOpenPost={onOpenPost}
            />
          </li>
        ))}
        {/* Show 2 skeletons when fetching the next page. */}
        {isLoading &&
          Array.from({ length: 2 }).map((_, index) => (
            <li key={`loading-${index}`}>
              <PostSkeletonCard />
            </li>
          ))}
      </ul>

      {/* Inline error and retry for subsequent pages. */}
      {isFailed && (
        <div role="alert" className="mt-4 rounded-lg border p-6 text-center">
          <p className="text-gray-700 dark:text-gray-200">
            {error || 'Unable to load more posts. Please try again.'}
          </p>

          <RetryButton />
        </div>
      )}
    </section>
  );
};

export default Feed;
