export default function PostCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="
        animate-pulse
        motion-reduce:animate-none
        rounded-lg border p-4
      "
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
