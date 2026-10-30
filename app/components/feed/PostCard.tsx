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
  isHighlighted?: boolean;
  onOpenPost?: (postId: string, viewportTop: number) => void;
}

const PostCard = ({
  post,
  variant = 'preview',
  isHighlighted,
  onOpenPost,
}: PostCardProps) => {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const avatarUrl = post.author.avatarUrl;
  const imageSrc =
    avatarUrl && failedAvatarUrl !== avatarUrl ? avatarUrl : fallbackAvatar;
  const formattedDate = formatDate(post.createdAt);
  const isPreview = variant === 'preview';
  const content = isPreview ? truncateText(post.content) : post.content;
  const Heading = isPreview ? 'h2' : 'h1';
  const showHighlight = variant === 'preview' && isHighlighted;
  const viewPostClassName = [
    'self-start rounded-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4',
    showHighlight
      ? 'text-blue-700 dark:text-blue-400 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-400'
      : 'text-orange-700 dark:text-orange-400 focus-visible:outline-orange-700 dark:focus-visible:outline-orange-400',
  ].join(' ');

  return (
    <article
      id={isPreview ? `feed-post-${post.id}` : undefined}
      data-highlighted={showHighlight ? 'true' : undefined}
      className={[
        'flex flex-col gap-2 rounded-md border p-4 shadow-sm',
        'transition-colors duration-500 motion-reduce:transition-none',
        showHighlight
          ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/50'
          : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900',
      ].join(' ')}
    >
      <div className="flex gap-3 justify-between">
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
        {showHighlight && (
          <span className="self-start rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-800 dark:text-white">
            New
          </span>
        )}
      </div>
      <Heading className="text-xl font-bold">{post.title}</Heading>
      <p className="whitespace-pre-wrap wrap-break-word">{content}</p>

      {isPreview && (
        <Link
          href={`/posts/${encodeURIComponent(post.id)}`}
          className={viewPostClassName}
          onClick={(e) => {
            // Ignore modified clicks that may open another tab.
            if (
              e.defaultPrevented ||
              e.button !== 0 ||
              e.metaKey ||
              e.altKey ||
              e.ctrlKey ||
              e.shiftKey
            ) {
              return;
            }

            const article = e.currentTarget.closest('article');

            const viewportTop = article?.getBoundingClientRect().top ?? 0;

            onOpenPost?.(post.id, viewportTop);
          }}
        >
          View post
          <span className="sr-only"> by {post.title}</span>
        </Link>
      )}
    </article>
  );
};

export default memo(PostCard);
