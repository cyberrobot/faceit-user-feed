import Link from 'next/link';
import { notFound } from 'next/navigation';

import PostCard from '@/app/components/feed/PostCard';
import { getPostById, posts } from '@/lib/data/posts';
import { Metadata } from 'next';
import { mockLivePosts } from '@/lib/data/mockLivePosts';
import { Suspense } from 'react';

export function generateStaticParams() {
  return [...posts, ...mockLivePosts].map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/posts/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const post = getPostById(id);

  return {
    title: post ? `${post.title} | ${post.author.name}` : 'Post not found',
  };
}

// URL-dependent rendering happens inside Suspense.
async function PostContent({
  params,
}: Pick<PageProps<'/posts/[id]'>, 'params'>) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return <PostCard post={post} variant="full" />;
}

export default async function PostPage({ params }: PageProps<'/posts/[id]'>) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-medium hover:underline"
      >
        ← Back to feed
      </Link>

      <Suspense fallback={<p role="status">Loading post...</p>}>
        <PostContent params={params} />
      </Suspense>
    </main>
  );
}
