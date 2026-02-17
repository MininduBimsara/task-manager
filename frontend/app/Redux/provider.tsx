"use client";

import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./Store/store";

function PersistGateClient({ children }: { children: React.ReactNode }) {
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = persistor.subscribe(() => {
      const { bootstrapped } = persistor.getState();
      if (bootstrapped) {
        setIsRehydrated(true);
        unsubscribe();
      }
    });

    // Check if already bootstrapped
    if (persistor.getState().bootstrapped) {
      setIsRehydrated(true);
    }

    return unsubscribe;
  }, []);

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
