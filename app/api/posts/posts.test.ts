import { describe, expect, it } from 'vitest';
import { GET as getPosts } from './route';
import { GET as getPost } from './[id]/route';
import { NextRequest } from 'next/server';

describe('GET /api/posts', () => {
  it('returns 20 posts on page 1', async () => {
    const response = await getPosts(
      new NextRequest('http://localhost/api/posts'),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.posts).toHaveLength(20);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
    expect(body.total).toBe(40);
  });

  it('returns the next 20 posts on page 2', async () => {
    const response = await getPosts(
      new NextRequest('http://localhost/api/posts?page=2'),
    );
    const body = await response.json();

    expect(body.posts).toHaveLength(20);
    expect(body.page).toBe(2);
    expect(body.posts[0].id).toBe('post-021');
  });

  it('rejects an invalid page number', async () => {
    const response = await getPosts(
      new NextRequest('http://localhost/api/posts?page=0'),
    );

    expect(response.status).toBe(400);
  });

  it('returns an empty page when requesting beyond the dataset', async () => {
    const response = await getPosts(
      new NextRequest('http://localhost/api/posts?page=3'),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.posts).toEqual([]);
    expect(body.page).toBe(3);
    expect(body.pageSize).toBe(20);
    expect(body.total).toBe(40);
  });
});

describe('GET /api/posts/[id]', () => {
  it('returns the post matching the ID', async () => {
    const response = await getPost(
      new NextRequest('http://localhost/api/posts/post-001'),
      { params: Promise.resolve({ id: 'post-001' }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe('post-001');
  });

  it('returns 404 for an unknown ID', async () => {
    const response = await getPost(
      new NextRequest('http://localhost/api/posts/no-such-post'),
      { params: Promise.resolve({ id: 'no-such-post' }) },
    );

    expect(response.status).toBe(404);
  });
});
