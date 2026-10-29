import type { Post } from '@/lib/types/post';
import { mockLivePosts } from '../data/mockLivePosts';

type PostListener = (post: Post) => void;

export function subscribeToMockPosts(
  listener: PostListener,
  intervalMs = 10_000,
): () => void {
  let index = 0;

  const timer = window.setInterval(() => {
    const post = mockLivePosts[index];

    if (!post) {
      window.clearInterval(timer);
      return;
    }

    index++;
    listener(post);

    if (index === mockLivePosts.length) {
      window.clearInterval(timer);
    }
  }, intervalMs);

  return () => window.clearInterval(timer);
}
