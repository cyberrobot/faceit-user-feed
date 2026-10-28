import { Post } from '@/lib/types/post';
import Image from 'next/image';
import avatar from '@/public/avatar.png';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <article className="flex flex-col gap-2 p-4 border rounded-md shadow-sm">
      <div className="flex gap-3">
        <Image
          src={post.author.avatarUrl || avatar}
          alt={post.author.name}
          width={40}
          height={40}
          unoptimized
        />
        <div>
          <h3 className="font-semibold">{post.author.name}</h3>
          <p>{post.createdAt}</p>
        </div>
      </div>
      <p>{post.content}</p>
    </article>
  );
};

export default PostCard;
