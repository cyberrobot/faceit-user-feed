import { Post } from '@/lib/types/post';
import Image from 'next/image';
import fallbackAvatar from '@/public/avatar.png';
import { truncateText } from '@/app/lib/utils/truncateText';
import { formatDate } from '@/app/lib/utils/formatDate';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const avatarUrl = post.author.avatarUrl;
  const imageSrc =
    avatarUrl && failedAvatarUrl !== avatarUrl ? avatarUrl : fallbackAvatar;
  const truncatedContent = truncateText(post.content);
  const formattedDate = formatDate(post.createdAt);
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
      <p>{truncatedContent}</p>
    </article>
  );
};

export default PostCard;
