"use client";

import { useState, useSyncExternalStore } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./Store/store";

function usePersistorRehydrated() {
  return useSyncExternalStore(
    (callback) => {
      const unsubscribe = persistor.subscribe(callback);
      return unsubscribe;
    },
    () => persistor.getState().bootstrapped,
    () => false,
  );
}

function PersistGateClient({ children }: { children: React.ReactNode }) {
  const isRehydrated = usePersistorRehydrated();

  if (!isRehydrated) return null;
  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGateClient>{children}</PersistGateClient>
    </Provider>
  );
}
