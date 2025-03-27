
import { supabase } from '@/integrations/supabase/client';
import { DataType, SyncStatus } from './types';

export const fetchCloudData = async <T extends 'players' | 'games'>(): Promise<{ data: DataType<T>[], hasChanges: boolean }> => {
  try {
    let result;
    if (T === 'players') {
      result = await supabase.from('players').select('*');
    } else {
      result = await supabase.from('games').select('*');
    }
    
    if (result.error) {
      throw result.error;
    }
    
    return { data: result.data || [], hasChanges: true };
  } catch (error) {
    console.error(`Error fetching data from Supabase:`, error);
    return { data: [], hasChanges: false };
  }
};

export const pushToCloud = async <T extends 'players' | 'games'>(data: DataType<T>[]): Promise<void> => {
  try {
    if (T === 'players') {
      await supabase.from('players').upsert(data);
    } else {
      // For games, we would need to handle the relation with game_players
      // This is a simplified version
      for (const game of data) {
        await supabase.from('games').upsert({
          id: game.id,
          // Add other game fields here
        });
      }
    }
  } catch (error) {
    console.error(`Error pushing data to Supabase:`, error);
  }
};

export const mergeData = <T extends 'players' | 'games'>(
  localData: DataType<T>[],
  cloudData: DataType<T>[]
): DataType<T>[] => {
  // Create a map of local items by ID
  const localMap = new Map(localData.map(item => [item.id, item]));
  
  // Create a map of cloud items by ID
  const cloudMap = new Map(cloudData.map(item => [item.id, item]));
  
  // Merge the data, preferring cloud data if it exists
  const allIds = new Set([...localMap.keys(), ...cloudMap.keys()]);
  
  const mergedData: DataType<T>[] = [];
  allIds.forEach(id => {
    const cloudItem = cloudMap.get(id);
    const localItem = localMap.get(id);
    
    if (cloudItem) {
      mergedData.push(cloudItem);
    } else if (localItem) {
      mergedData.push(localItem);
    }
  });
  
  return mergedData;
};

export const setupCloudListener = <T extends 'players' | 'games'>(
  store: T,
  onCloudUpdate: () => void
): () => void => {
  const channel = store === 'players' 
    ? supabase
        .channel('public:players')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, onCloudUpdate)
        .subscribe()
    : supabase
        .channel('public:games')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, onCloudUpdate)
        .subscribe();
  
  // Return a cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};
