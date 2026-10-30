'use client';

import { Post } from '@/lib/types/post';
import Image from 'next/image';
import fallbackAvatar from '@/public/avatar.png';
import { truncateText } from '@/app/lib/utils/truncateText';
import { formatDate } from '@/app/lib/utils/formatDate';
import { memo, useState } from 'react';
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
  const Heading = isPreview ? 'h2' : 'h1';

  return (
    <article className="flex flex-col gap-2 p-4 border rounded-md shadow-sm bg-white dark:bg-zinc-900">
      <div className="flex gap-3">
        <Image
          data-testid="author-avatar"
          src={imageSrc}
          alt=""
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
          className="h-10 w-10 rounded-full object-cover shrink-0"
        />
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <time
            dateTime={post.createdAt}
            className="text-sm text-gray-500 dark:text-gray-300"
          >
            Posted: {formattedDate}
          </time>
        </div>
      </div>
      <Heading className="text-xl font-bold">{post.title}</Heading>
      <p className="whitespace-pre-wrap wrap-break-word">{content}</p>

      {isPreview && (
        <Link
          href={`/posts/${encodeURIComponent(post.id)}`}
          className="
            self-start rounded-sm font-medium
            text-blue-600 dark:text-blue-400
            hover:underline
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-blue-600
            dark:focus-visible:outline-blue-400"
        >
          View post
          <span className="sr-only"> by {post.title}</span>
        </Link>
      )}
    </article>
  );
};

export default memo(PostCard);
