import { getPostById } from '@/lib/data/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const post = getPostById(id);

  if (!post) {
    return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
  }

  return NextResponse.json(post);
}
