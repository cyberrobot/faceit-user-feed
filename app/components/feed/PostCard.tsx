'use client';

import { Post } from '@/lib/types/post';
import Image from 'next/image';
import fallbackAvatar from '@/public/avatar.png';
import { truncateText } from '@/app/lib/utils/truncateText';
import { formatDate } from '@/app/lib/utils/formatDate';
import { useState } from 'react';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  variant?: 'preview' | 'full';
}

const PostCard = ({ post, variant = 'preview' }: PostCardProps) => {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const avatarUrl = post.author.avatarUrl;
  const imageSrc =
    avatarUrl && failedAvatarUrl !== avatarUrl ? avatarUrl : fallbackAvatar;
  const formattedDate = formatDate(post.createdAt);
  const isPreview = variant === 'preview';
  const content = isPreview ? truncateText(post.content) : post.content;

  return (
    <article className="flex flex-col gap-2 p-4 border rounded-md shadow-sm bg-white dark:bg-zinc-900">
      <div className="flex gap-3">
        <Image
          src={imageSrc}
          alt={post.author.name}
          width={40}
          height={40}
          // Next's image optimizer does not support the generated SVG avatar URLs.
          unoptimized={
            typeof imageSrc === 'string' && imageSrc.includes('/svg')
          }
          placeholder="blur"
          blurDataURL={fallbackAvatar.blurDataURL}
          onError={() => {
            if (typeof imageSrc === 'string') {
              setFailedAvatarUrl(imageSrc);
            }
          }}
          className="rounded-full object-cover shrink-0"
        />
        <div>
          <h3 className="font-semibold">{post.author.name}</h3>
          <p className="text-sm text-gray-500">Posted: {formattedDate}</p>
        </div>
      </div>
      <h1 className="text-xl font-bold">{post.title}</h1>
      <p className="whitespace-pre-wrap wrap-break-word">{content}</p>

      {isPreview && (
        <Link
          href={`/posts/${encodeURIComponent(post.id)}`}
          className="self-start font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          View post
          <span className="sr-only"> by {post.author.name}</span>
        </Link>
      )}
    </article>
  );
};

export default PostCard;
