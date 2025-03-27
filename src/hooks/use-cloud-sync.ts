
import { useState, useEffect } from 'react';
import { useIndexedDB } from './use-indexed-db';
import { Game, Player } from '@/lib/game-stats-types';
import { useToast } from './use-toast';

// This is used to track sync status
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

// Fixed mapping type to directly use Player or Game based on T
export type DataType<T extends 'players' | 'games'> = T extends 'players' ? Player : Game;

// This defines the structure of our cloud sync hook return
export interface CloudSyncResult<T extends 'players' | 'games'> {
  data: DataType<T>[];
  setData: (value: DataType<T>[] | ((val: DataType<T>[]) => DataType<T>[])) => void;
  syncStatus: SyncStatus;
  lastSynced: Date | null;
  syncNow: () => Promise<void>;
  setSyncEnabled: (enabled: boolean) => void;
  syncEnabled: boolean;
}

// Constants for cloud sync
const SYNC_INTERVAL = 60000; // 1 minute
const SYNC_KEY_PREFIX = 'goa-sync-';
const SYNC_ENABLED_KEY = 'goa-sync-enabled';

export function useCloudSync<T extends 'players' | 'games'>(
  storeName: T,
  defaultValue: DataType<T>[] = [] as DataType<T>[]
): CloudSyncResult<T> {
  // Use our existing IndexedDB hook for local storage
  const [localData, setLocalData] = useIndexedDB<DataType<T>>(storeName, defaultValue);
  
  // Add state for sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncEnabled, setSyncEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SYNC_ENABLED_KEY) === 'true';
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
      const syncKey = `${SYNC_KEY_PREFIX}${storeName}-last-sync`;
      const lastSyncTime = localStorage.getItem(syncKey);
      
      // In a real app, we would send the lastSyncTime to the server
      // to only get changes since that time
      const cloudDataResponse = await fetchCloudData(storeName, lastSyncTime);
      
      if (cloudDataResponse.hasChanges) {
        // Merge local data with cloud data
        // In a real implementation, this would handle conflicts
        const mergedData = mergeData(localData, cloudDataResponse.data);
        setLocalData(mergedData);
        
        // Then push our merged data back to the cloud
        await pushToCloud(storeName, mergedData);
      }
      
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
  
  // Mock functions for cloud operations
  // In a real app, these would make API calls to your backend
  const fetchCloudData = async (store: string, lastSync: string | null): Promise<{ data: DataType<T>[], hasChanges: boolean }> => {
    // In a real implementation, this would fetch from your backend API
    console.log(`Fetching cloud data for ${store} since ${lastSync}`);
    
    // For now, we'll pretend there are no cloud changes
    // In a real implementation, this would return actual data from the server
    return { data: [] as DataType<T>[], hasChanges: false };
  };
  
  const pushToCloud = async (store: string, data: DataType<T>[]): Promise<void> => {
    // In a real implementation, this would push to your backend API
    console.log(`Pushing ${data.length} items to cloud for ${store}`);
    // Here we would actually send the data to the server
  };
  
  const mergeData = (localData: DataType<T>[], cloudData: DataType<T>[]): DataType<T>[] => {
    // In a real implementation, this would handle merging and conflict resolution
    // For now, we'll just use local data
    return localData;
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
    localStorage.setItem(SYNC_ENABLED_KEY, enabled ? 'true' : 'false');
    
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
      interval = setInterval(syncWithCloud, SYNC_INTERVAL) as unknown as number;
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [syncEnabled]);
  
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
    data: localData,
    setData: setLocalData,
    syncStatus,
    lastSynced,
    syncNow,
    setSyncEnabled: handleSetSyncEnabled,
    syncEnabled
  };
}
