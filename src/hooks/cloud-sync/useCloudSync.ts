
import { useState, useEffect } from 'react';
import { useIndexedDB } from '@/hooks/use-indexed-db';
import { useToast } from '@/hooks/use-toast';
import { CloudSyncResult, DataType, SyncStatus, SYNC_CONSTANTS } from './types';
import { fetchCloudData, pushToCloud, mergeData, setupCloudListener } from './utils';

export function useCloudSync<T extends 'players' | 'games'>(
  storeName: T,
  defaultValue: DataType<T>[] = [] as DataType<T>[]
): CloudSyncResult<T> {
  // Use our existing IndexedDB hook for local storage
  // We need to cast types properly between the hooks
  const [localData, setLocalData] = useIndexedDB(storeName, defaultValue as any);
  
  // Add state for sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    const syncKey = `${SYNC_CONSTANTS.KEY_PREFIX}${storeName}-last-sync`;
    const lastSyncTime = localStorage.getItem(syncKey);
    return lastSyncTime ? new Date(lastSyncTime) : null;
  });
  const [syncEnabled, setSyncEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SYNC_CONSTANTS.ENABLED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  
  const { toast } = useToast();

  // This function will handle synchronizing with the cloud
  const syncWithCloud = async () => {
    if (!syncEnabled) return;
    
    try {
      setSyncStatus('syncing');
      
      // Get the last sync timestamp for this data type
      const syncKey = `${SYNC_CONSTANTS.KEY_PREFIX}${storeName}-last-sync`;
      const lastSyncTime = localStorage.getItem(syncKey);
      
      // First, fetch any changes from the cloud
      const cloudDataResponse = await fetchCloudData<T>(storeName, lastSyncTime);
      
      if (cloudDataResponse.hasChanges) {
        // Merge local data with cloud data
        const mergedData = mergeData<T>(localData as DataType<T>[], cloudDataResponse.data);
        setLocalData(mergedData as any);
      }
      
      // Then push our current data back to the cloud
      await pushToCloud<T>(storeName, localData as DataType<T>[]);
      
      // Update last sync time
      const now = new Date();
      localStorage.setItem(syncKey, now.toISOString());
      setLastSynced(now);
      setSyncStatus('synced');
      
    } catch (error) {
      console.error('Error syncing with cloud:', error);
      setSyncStatus('error');
      toast({
        title: "Sync Failed",
        description: "Failed to sync your data with the cloud. Will retry later.",
        variant: "destructive"
      });
    }
  };
  
  // Function to manually trigger sync
  const syncNow = async () => {
    if (!syncEnabled) {
      toast({
        title: "Sync Disabled",
        description: "Please enable sync first.",
      });
      return;
    }
    
    await syncWithCloud();
    
    if (syncStatus !== 'error') {
      toast({
        title: "Sync Complete",
        description: "Your data has been synchronized with the cloud."
      });
    }
  };
  
  // Toggle sync enabled/disabled
  const handleSetSyncEnabled = (enabled: boolean) => {
    setSyncEnabled(enabled);
    localStorage.setItem(SYNC_CONSTANTS.ENABLED_KEY, enabled ? 'true' : 'false');
    
    if (enabled) {
      toast({
        title: "Sync Enabled",
        description: "Your data will now be synchronized across devices."
      });
      // Initial sync when enabled
      syncWithCloud();
    } else {
      toast({
        title: "Sync Disabled",
        description: "Your data will no longer be synchronized across devices."
      });
    }
  };
  
  // Set up automatic sync interval
  useEffect(() => {
    let interval: number | undefined;
    
    if (syncEnabled) {
      // Perform initial sync
      syncWithCloud();
      
      // Set up interval for regular syncing
      interval = setInterval(syncWithCloud, SYNC_CONSTANTS.INTERVAL) as unknown as number;
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [syncEnabled]);
  
  // Set up cloud listener for changes from other tabs/windows
  useEffect(() => {
    if (!syncEnabled) return;
    
    // Set up cloud listener and get cleanup function
    const cleanup = setupCloudListener(storeName, () => {
      syncWithCloud();
    });
    
    return cleanup;
  }, [syncEnabled, storeName]);
  
  // Also sync when we detect the online status has changed to online
  useEffect(() => {
    const handleOnline = () => {
      if (syncEnabled) {
        toast({
          title: "Back Online",
          description: "Synchronizing your latest data..."
        });
        syncWithCloud();
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [syncEnabled]);
  
  return {
    data: localData as DataType<T>[],
    setData: setLocalData as (value: DataType<T>[] | ((val: DataType<T>[]) => DataType<T>[])) => void,
    syncStatus,
    lastSynced,
    syncNow,
    setSyncEnabled: handleSetSyncEnabled,
    syncEnabled
  };
}
