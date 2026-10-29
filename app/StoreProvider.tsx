'use client';

import { AppStore, makeStore } from '@/lib/store';
import { useState } from 'react';
import { Provider } from 'react-redux';
import FeedUpdatesSubscriber from './components/feed/FeedUpdatesSubscriber';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the store instance the first time this renders
  const [store] = useState<AppStore>(makeStore);

  return (
    <Provider store={store}>
      <FeedUpdatesSubscriber />
      {children}
    </Provider>
  );
}
