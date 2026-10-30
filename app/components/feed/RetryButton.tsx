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
      className="
        mt-4 min-h-12 rounded-full
        bg-foreground px-5 text-background
        hover:opacity-90
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-blue-600
        dark:focus-visible:outline-blue-400
      "
    >
      Try again
    </button>
  );
}
