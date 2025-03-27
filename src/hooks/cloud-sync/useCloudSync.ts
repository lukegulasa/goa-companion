
import { useState } from 'react';
import { useIndexedDB } from '@/hooks/use-indexed-db';
import { CloudSyncResult, DataType } from './types';

export function useCloudSync<T extends 'players' | 'games'>(
  storeName: T,
  defaultValue: DataType<T>[] = [] as DataType<T>[]
): CloudSyncResult<T> {
  // Use our existing IndexedDB hook for local storage
  const [localData, setLocalData] = useIndexedDB(storeName, defaultValue as any);
  
  return {
    data: localData as DataType<T>[],
    setData: setLocalData as (value: DataType<T>[] | ((val: DataType<T>[]) => DataType<T>[])) => void,
    syncStatus: 'idle',
    lastSynced: null,
    syncNow: async () => {},
    setSyncEnabled: () => {},
    syncEnabled: false
  };
}
