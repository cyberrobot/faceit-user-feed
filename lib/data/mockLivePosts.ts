import type { Post } from '@/lib/types/post';

export const mockLivePosts: Post[] = [
  {
    id: 'live-001',
    title: 'An Incredible CS2 Comeback',
    content: 'We were losing 4–11 before pulling off an unbelievable comeback.',
    author: {
      id: 'author-live',
      name: 'Alex Morgan',
      username: 'alexmorgan',
      avatarUrl: '',
    },
    createdAt: '2026-10-29T16:00:00.000Z',
  },
  {
    id: 'live-002',
    title: 'Finally Reached Level 10',
    content: 'After months of practice, I finally reached FACEIT Level 10.',
    author: {
      id: 'author-live',
      name: 'Alex Morgan',
      username: 'alexmorgan',
      avatarUrl: '',
    },
    createdAt: '2026-10-29T16:05:00.000Z',
  },
];
