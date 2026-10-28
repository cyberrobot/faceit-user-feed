import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Post } from '@/lib/types/post';
import { FEED_PAGE_SIZE } from '@/app/config/feed';
import Feed from './Feed';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src.src} alt={alt} />
  ),
}));

function makePosts(count: number): Post[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `post-${index + 1}`,
    author: {
      id: `user-${index + 1}`,
      name: `Author ${index + 1}`,
      username: `author${index + 1}`,
      avatarUrl: '',
    },
    content: `Post content ${index + 1}`,
    createdAt: '2026-10-28T14:30:00Z',
  }));
}

afterEach(cleanup);

describe('Feed', () => {
  it('displays 20 posts', () => {
    render(<Feed posts={makePosts(20)} status="succeeded" />);

    expect(screen.getAllByRole('article')).toHaveLength(20);
    expect(screen.getByText('Author 1')).toBeTruthy();
    expect(screen.getByText('Author 20')).toBeTruthy();
  });

  it('limits rendering to FEED_PAGE_SIZE', () => {
    render(<Feed posts={makePosts(25)} status="succeeded" />);

    expect(screen.getAllByRole('article')).toHaveLength(FEED_PAGE_SIZE);
    expect(screen.queryByText('Author 21')).toBeNull();
  });

  it('displays fewer posts when fewer are available', () => {
    render(<Feed posts={makePosts(5)} status="succeeded" />);

    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it.each(['idle', 'loading'] as const)(
    'displays skeletons during %s state',
    (status) => {
      const { container } = render(<Feed posts={[]} status={status} />);

      expect(
        screen.getByRole('status', { name: 'Loading posts' }),
      ).toBeTruthy();

      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
        FEED_PAGE_SIZE,
      );
    },
  );

  it('displays the empty state', () => {
    render(<Feed posts={[]} status="succeeded" />);

    expect(screen.getByText('No posts available.')).toBeTruthy();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  it('displays the error message', () => {
    render(<Feed posts={[]} status="failed" error="Network unavailable" />);

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Network unavailable')).toBeTruthy();
  });

  it('displays a fallback error message', () => {
    render(<Feed posts={[]} status="failed" />);

    expect(
      screen.getByText('Unable to load posts. Please try again.'),
    ).toBeTruthy();
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<Feed posts={[]} status="failed" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('does not display retry without an onRetry callback', () => {
    render(<Feed posts={[]} status="failed" />);

    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
  });
});
