import { Post } from '@/lib/types/post';
import PostCard from './PostCard';
import { FEED_PAGE_SIZE } from '@/app/config/feed';
import PostSkeletonCard from './PostCardSkeleton';

type FeedStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface FeedProps {
  posts: Post[];
  status: FeedStatus;
  error?: string | null;
  onRetry?: () => void;
}

const Feed = ({ posts, status, error, onRetry }: FeedProps) => {
  if (status === 'idle' || status === 'loading') {
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

  if (status === 'failed') {
    return (
      <div role="alert" className="rounded-lg border p-6 text-center">
        <p className="text-gray-700">
          {error || 'Unable to load posts. Please try again.'}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 h-12 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-gray-500">No posts available.</p>
      </div>
    );
  }

  return (
    <section aria-label="Posts feed">
      <ul className="space-y-4">
        {/* Keep the visible feed to one page even if the store has more posts loaded. */}
        {posts.slice(0, FEED_PAGE_SIZE).map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Feed;
