import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import type { Post } from '@/lib/types/post';
import { FEED_PAGE_SIZE } from '@/app/config/feed';
import Feed, { FeedStatus } from './Feed';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';
import { ImageProps } from 'next/image';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: ImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      src={
        typeof src === 'string' ? src : 'src' in src ? src.src : src.default.src
      }
    />
  ),
}));

function renderContainer(
  posts: Post[],
  status: FeedStatus,
  error?: string | null,
) {
  const store = makeStore();

  const view = render(
    <Provider store={store}>
      <Feed posts={posts} status={status} error={error} />
    </Provider>,
  );

  return { store, ...view };
}

function makePosts(count: number): Post[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `post-${index + 1}`,
    author: {
      id: `user-${index + 1}`,
      name: `Author ${index + 1}`,
      username: `author${index + 1}`,
      avatarUrl: '',
    },
    title: `Post ${index + 1}`,
    content: `Post content ${index + 1}`,
    createdAt: '2026-10-28T14:30:00Z',
  }));
}

afterEach(cleanup);

describe('Feed', () => {
  it('displays 20 posts', () => {
    renderContainer(makePosts(20), 'succeeded');

    expect(screen.getAllByRole('article')).toHaveLength(20);
    expect(screen.getByText('Author 1')).toBeTruthy();
    expect(screen.getByText('Author 20')).toBeTruthy();
  });

  it('displays fewer posts when fewer are available', () => {
    renderContainer(makePosts(5), 'succeeded');

    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it.each(['idle', 'loading'] as const)(
    'displays skeletons during %s state',
    (status) => {
      const { container } = renderContainer([], status);

      expect(
        screen.getByRole('status', { name: 'Loading posts' }),
      ).toBeTruthy();

      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
        FEED_PAGE_SIZE,
      );
    },
  );

  it('displays the empty state', () => {
    renderContainer([], 'succeeded');

    expect(screen.getByText('No posts available.')).toBeTruthy();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  it('displays the error message', () => {
    renderContainer([], 'failed', 'Network unavailable');

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Network unavailable')).toBeTruthy();
  });

  it('displays a fallback error message', () => {
    renderContainer([], 'failed');

    expect(
      screen.getByText('Unable to load posts. Please try again.'),
    ).toBeTruthy();
  });

  it('keeps existing posts visible while loading more', () => {
    const { container } = renderContainer(makePosts(20), 'loading');

    // The existing 20 posts must remain visible.
    expect(screen.getAllByRole('article')).toHaveLength(20);
    expect(screen.getByText('Author 1')).toBeTruthy();
    expect(screen.getByText('Author 20')).toBeTruthy();

    // Only 2 additional skeletons should appear.
    expect(
      container.querySelectorAll('li > div[aria-hidden="true"]'),
    ).toHaveLength(2);

    // Mark the feed as busy for assistive technology.
    expect(
      screen
        .getByRole('region', { name: 'Posts feed' })
        .getAttribute('aria-busy'),
    ).toBe('true');
  });

  it('keeps existing posts visible when loading more fails', async () => {
    renderContainer(makePosts(20), 'failed', 'Unable to load page 2');

    // Already loaded posts remain visible.
    expect(screen.getAllByRole('article')).toHaveLength(20);

    // Display the pagination error beneath the feed.
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Unable to load page 2')).toBeTruthy();

    // Retry remains available.
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });
});
