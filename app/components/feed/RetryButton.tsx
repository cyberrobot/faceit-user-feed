'use client';

import { fetchPosts } from '@/lib/features/feed/feedSlice';
import { AppDispatch } from '@/lib/store';
import { useDispatch } from 'react-redux';

export function RetryButton() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <button
      type="button"
      onClick={() => void dispatch(fetchPosts())}
      className="mt-4 h-12 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
    >
      Try again
    </button>
  );
}
