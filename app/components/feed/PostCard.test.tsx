import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { Post } from '@/lib/types/post';
import PostCard from './PostCard';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    onError,
  }: {
    src: string | { src: string };
    alt: string;
    onError?: () => void;
  }) => (
    <img
      src={typeof src === 'string' ? src : src.src}
      alt={alt}
      onError={onError}
    />
  ),
}));

const post: Post = {
  id: 'post-001',
  author: {
    id: 'user-001',
    name: 'Maya Chen',
    username: 'mayachen',
    avatarUrl: 'https://api.dicebear.com/10.x/lorelei/svg?seed=mayachen',
  },
  content: 'a'.repeat(120),
  createdAt: '2026-10-28T14:30:00Z',
};

afterEach(cleanup);

describe('PostCard', () => {
  it('renders author name and formatted date', () => {
    render(<PostCard post={post} />);

    expect(screen.getByText('Maya Chen')).toBeTruthy();
    expect(screen.getByText('Posted: 28 Oct 2026')).toBeTruthy();
  });

  it('truncates the preview to 100 characters', () => {
    render(<PostCard post={post} />);

    const preview = screen.getByText(`${'a'.repeat(99)}…`);

    expect(preview.textContent).toHaveLength(100);
  });

  it('does not truncate short posts', () => {
    render(<PostCard post={{ ...post, content: 'Short post content' }} />);

    expect(screen.getByText('Short post content')).toBeTruthy();
  });

  it('renders the author avatar', () => {
    render(<PostCard post={post} />);

    const image = screen.getByRole('img', {
      name: 'Maya Chen',
    });

    expect(image.getAttribute('src')).toBe(post.author.avatarUrl);
  });

  it('uses the fallback image when the avatar URL is empty', () => {
    render(
      <PostCard
        post={{
          ...post,
          author: { ...post.author, avatarUrl: '' },
        }}
      />,
    );

    const image = screen.getByRole('img', {
      name: 'Maya Chen',
    });

    expect(image.getAttribute('src')).toContain('avatar.png');
  });

  it('displays fallback avatar when remote image fails', () => {
    render(<PostCard post={post} />);

    const avatar = screen.getByRole('img', {
      name: 'Maya Chen',
    });

    expect(avatar.getAttribute('src')).toBe(post.author.avatarUrl);

    fireEvent.error(avatar);

    expect(avatar.getAttribute('src')).toContain('avatar.png');
  });
});
