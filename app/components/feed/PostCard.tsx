import { Post } from '@/lib/types/post';
import Image from 'next/image';
import fallbackAvatar from '@/public/avatar.png';
import { truncateText } from '@/app/lib/utils/truncateText';
import { formatDate } from '@/app/lib/utils/formatDate';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const truncatedContent = truncateText(post.content);
  const formattedDate = formatDate(post.createdAt);
  return (
    <article className="flex flex-col gap-2 p-4 border rounded-md shadow-sm">
      <div className="flex gap-3">
        <Image
          src={post.author.avatarUrl || fallbackAvatar}
          alt={post.author.name}
          width={50}
          height={40}
          unoptimized={Boolean(post.author.avatarUrl?.includes('/svg'))}
          placeholder="blur"
          blurDataURL={fallbackAvatar.blurDataURL}
          className="rounded-full object-cover"
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
