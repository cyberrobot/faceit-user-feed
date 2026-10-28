export default function PostCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
    >
      {/* Avatar and author */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />

        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {/* Post preview */}
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
