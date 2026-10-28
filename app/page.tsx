import FeedContainer from './components/feed/FeedContainer';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-4 px-4 bg-white dark:bg-black sm:items-start">
        <FeedContainer />
      </main>
    </div>
  );
}
