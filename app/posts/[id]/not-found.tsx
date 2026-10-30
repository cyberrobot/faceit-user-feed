import Link from 'next/link';

export default function PostNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 text-center">
      <h1 className="mb-3 text-2xl font-semibold">Post not found</h1>

      <p className="mb-6 text-gray-500 dark:text-gray-300">
        This post doesn&apos;t exist or is no longer available.
      </p>

      <Link
        href="/"
        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        Back to feed
      </Link>
    </main>
  );
}
