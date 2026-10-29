import Link from 'next/link';
import { notFound } from 'next/navigation';

import PostCard from '@/app/components/feed/PostCard';
import { getPostById, posts } from '@/lib/data/posts';

export function generateStaticParams() {
  return posts.map(({ id }) => ({ id }));
}

export default async function PostPage({ params }: PageProps<'/posts/[id]'>) {
  const { id } = await params;

  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-medium hover:underline"
      >
        ← Back to feed
      </Link>

      <h1 className="sr-only">Post by {post.author.name}</h1>

      <PostCard post={post} variant="full" />
    </main>
  );
}
