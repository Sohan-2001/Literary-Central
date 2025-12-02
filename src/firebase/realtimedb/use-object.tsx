'use client';

import { useState, useEffect } from 'react';
import { Database, ref, onValue, off, Query } from 'firebase/database';
import { useDatabase } from '@/firebase/provider';

interface UseObjectResult<T> {
  data: (T & { id: string }) | null;
  isLoading: boolean;
  error: Error | null;
}

export function useObject<T = any>(path: string | Query | null): UseObjectResult<T> {
  const db = useDatabase();
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path || !db) {
        setIsLoading(false);
        return;
    };

    const queryRef = typeof path === 'string' ? ref(db, path) : path;

    const listener = onValue(queryRef, (snapshot) => {
      if (snapshot.exists()) {
        setData({ ...snapshot.val(), id: snapshot.key as string });
      } else {
        setData(null);
      }
      setIsLoading(false);
    }, (err) => {
      setError(err);
      setIsLoading(false);
      console.error(err);
    });

    return () => {
      off(queryRef, 'value', listener);
    };
  }, [db, path]);

  return { data, isLoading, error };
}
