import { supabase } from '@/integrations/supabase/client';
import { DataType, SyncStatus } from './types';

export const fetchCloudData = async <T extends 'players' | 'games'>
(store: T): Promise<{ data: DataType<T>[], hasChanges: boolean }> => {
  try {
    let result;
    if (store === 'players') {
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

export const pushToCloud = async <T extends 'players' | 'games'>(
  store: T,
  data: DataType<T>[]
): Promise<void> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (store === 'players') {
      // Map player data to match database column names
      const playerData = data.map(player => ({
        id: (player as any).id,
        name: (player as any).name
      }));
      
      await supabase.from('players').upsert(playerData);
    } else {
      // For games, handle column name mapping and the relation with game_players
      for (const game of data) {
        const gameData = {
          id: (game as any).id,
          date: (game as any).date,
          winningteam: (game as any).winningTeam, // Note: lowercase column name in DB
          victorymethod: (game as any).victoryMethod // Note: lowercase column name in DB
        };
        
        await supabase.from('games').upsert(gameData);
        
        // Handle game players if they exist
        if ((game as any).players && (game as any).players.length > 0) {
          // Delete existing game players
          await supabase
            .from('game_players')
            .delete()
            .eq('game_id', (game as any).id);
            
          // Insert new game players
          const gamePlayers = (game as any).players.map((player: any) => ({
            game_id: (game as any).id,
            player_id: player.playerId,
            playername: player.playerName,
            team: player.team,
            heroid: player.heroId,
            heroname: player.heroName
          }));
          
          await supabase.from('game_players').insert(gamePlayers);
        }
      }
    }
  } catch (error) {
    console.error(`Error pushing data to Supabase:`, error);
    throw error;
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

export const checkAdminStatus = async (): Promise<boolean> => {
  // All users are considered admins since authentication is removed
  return true;
};

export const addUserAsAdmin = async (userId: string): Promise<void> => {
  // No-op function since admin management is removed
  console.log('Admin management is disabled');
};
