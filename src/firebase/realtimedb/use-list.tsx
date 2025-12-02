'use client';

import { useState, useEffect } from 'react';
import { Database, ref, onValue, off, Query } from 'firebase/database';
import { useDatabase } from '@/firebase/provider';

interface UseListResult<T> {
  data: (T & { id: string })[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useList<T = any>(path: string | Query | null): UseListResult<T> {
  const db = useDatabase();
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path || !db) {
      setIsLoading(false);
      return;
    }

    const queryRef = typeof path === 'string' ? ref(db, path) : path;

    const listener = onValue(queryRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.keys(val).map(key => ({ ...val[key], id: key }));
        setData(list);
      } else {
        setData([]);
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
