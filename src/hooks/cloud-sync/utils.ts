
import { DataType, SYNC_CONSTANTS } from './types';

// Generate a unique domain-specific key for the cloud data
const getCloudKey = <T extends 'players' | 'games'>(store: T): string => 
  `${SYNC_CONSTANTS.KEY_PREFIX}cloud-${store}`;

// Simulate cloud storage using localStorage as the shared storage medium
export const fetchCloudData = async <T extends 'players' | 'games'>(
  store: T, 
  lastSync: string | null
): Promise<{ data: DataType<T>[], hasChanges: boolean }> => {
  console.log(`Fetching cloud data for ${store} since ${lastSync}`);
  
  try {
    // Get data from our simulated "cloud" (localStorage)
    const cloudKey = getCloudKey(store);
    const cloudDataString = localStorage.getItem(cloudKey);
    
    if (!cloudDataString) {
      return { data: [] as DataType<T>[], hasChanges: false };
    }
    
    const cloudData = JSON.parse(cloudDataString) as {
      data: DataType<T>[];
      lastUpdated: string;
    };
    
    // Check if there's anything new since last sync
    if (lastSync && new Date(cloudData.lastUpdated) <= new Date(lastSync)) {
      return { data: [] as DataType<T>[], hasChanges: false };
    }
    
    return { 
      data: cloudData.data, 
      hasChanges: true 
    };
  } catch (error) {
    console.error(`Error fetching cloud data for ${store}:`, error);
    return { data: [] as DataType<T>[], hasChanges: false };
  }
};

export const pushToCloud = async <T extends 'players' | 'games'>(
  store: T, 
  data: DataType<T>[]
): Promise<void> => {
  console.log(`Pushing ${data.length} items to cloud for ${store}`);
  
  try {
    // Store in our simulated "cloud" (localStorage) with timestamp
    const cloudKey = getCloudKey(store);
    const cloudData = {
      data,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(cloudKey, JSON.stringify(cloudData));
    
    // Broadcast a custom event to notify other open tabs
    const updateEvent = new CustomEvent('cloud-data-update', {
      detail: { store, timestamp: cloudData.lastUpdated }
    });
    window.dispatchEvent(updateEvent);
  } catch (error) {
    console.error(`Error pushing data to cloud for ${store}:`, error);
    throw error; // Re-throw to let the calling code handle it
  }
};

export const mergeData = <T extends 'players' | 'games'>(
  localData: DataType<T>[], 
  cloudData: DataType<T>[]
): DataType<T>[] => {
  if (!cloudData.length) return localData;
  if (!localData.length) return cloudData;
  
  // Create a map of existing items by ID for quick lookup
  const localMap = new Map(
    localData.map(item => [item.id, item])
  );
  
  // First, add all cloud items that don't exist locally
  for (const cloudItem of cloudData) {
    if (!localMap.has(cloudItem.id)) {
      localMap.set(cloudItem.id, cloudItem);
    }
  }
  
  // Return the merged data
  return Array.from(localMap.values());
};

// Add a listener setup function to detect cloud changes from other tabs/windows
export const setupCloudListener = <T extends 'players' | 'games'>(
  store: T,
  onCloudUpdate: () => void
): () => void => {
  const handleCloudUpdate = (event: CustomEvent) => {
    const detail = event.detail as { store: string; timestamp: string };
    if (detail.store === store) {
      console.log(`Detected cloud update for ${store} at ${detail.timestamp}`);
      onCloudUpdate();
    }
  };
  
  // Add event listener
  window.addEventListener('cloud-data-update', handleCloudUpdate as EventListener);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('cloud-data-update', handleCloudUpdate as EventListener);
  };
};
