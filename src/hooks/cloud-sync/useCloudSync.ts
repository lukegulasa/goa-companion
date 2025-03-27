
import { useState, useEffect, useCallback } from 'react';
import { CloudSyncResult, DataType, SyncStatus } from './types';
import { fetchCloudData, pushToCloud, setupCloudListener } from './utils';

export function useCloudSync<T extends 'players' | 'games'>(
  storeName: T,
  defaultValue: DataType<T>[] = [] as DataType<T>[]
): CloudSyncResult<T> {
  const [data, setLocalData] = useState<DataType<T>[]>(defaultValue);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  // Load initial data from Supabase
  const fetchInitialData = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      
      const { data: cloudData } = await fetchCloudData(storeName);
      
      // If we have cloud data, use it
      if (cloudData && cloudData.length > 0) {
        setLocalData(cloudData as DataType<T>[]);
      }
      
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
      console.error(`Error syncing with Supabase (${storeName}):`, error);
      setSyncStatus('error');
    }
  }, [storeName]);
  
  // Initial data load
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  
  // Set up real-time listener for changes
  useEffect(() => {
    const cleanupListener = setupCloudListener(storeName, fetchInitialData);
    
    return () => {
      cleanupListener();
    };
  }, [storeName, fetchInitialData]);
  
  // Function to save data to Supabase
  const saveData = useCallback(async (newData: DataType<T>[]): Promise<void> => {
    try {
      setSyncStatus('syncing');
      
      await pushToCloud(storeName, newData);
      
      setLocalData(newData);
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
      console.error(`Error saving to Supabase (${storeName}):`, error);
      setSyncStatus('error');
      
      // Still update local data to prevent data loss
      setLocalData(newData);
    }
  }, [storeName]);
  
  // Function to manually trigger sync
  const syncNow = useCallback(async () => {
    await fetchInitialData();
  }, [fetchInitialData]);
  
  return {
    data,
    setData: saveData,
    syncStatus,
    lastSynced,
    syncNow
  };
}
