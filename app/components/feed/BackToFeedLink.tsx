'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';

export default function BackToFeedLink() {
  const hasBookmark = useSelector(
    (state: RootState) => state.feed.scrollBookmark !== null,
  );

  return (
    <Link
      href="/"
      scroll={!hasBookmark}
      className="mb-6 inline-block text-sm font-medium hover:underline"
    >
      ← Back to feed
    </Link>
  );
}
