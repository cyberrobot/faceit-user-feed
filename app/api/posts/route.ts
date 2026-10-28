import { posts } from '@/lib/data/posts';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;

export function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get('page');
  const page = pageParam === null ? 1 : Number(pageParam);

  if (!Number.isInteger(page) || page < 1) {
    return NextResponse.json(
      { error: 'The page parameter must be a positive whole number.' },
      { status: 400 },
    );
  }

  const start = (page - 1) * PAGE_SIZE;
  const pagePosts = posts.slice(start, start + PAGE_SIZE);

  return NextResponse.json({
    posts: pagePosts,
    page,
    pageSize: PAGE_SIZE,
    total: posts.length,
  });
}
