
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CloudSyncResult, DataType, SyncStatus, SYNC_CONSTANTS } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';

export function useCloudSync<T extends 'players' | 'games'>(
  storeName: T,
  defaultValue: DataType<T>[] = [] as DataType<T>[]
): CloudSyncResult<T> {
  const [data, setLocalData] = useState<DataType<T>[]>(defaultValue);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncEnabled, setSyncEnabledState] = useLocalStorage(SYNC_CONSTANTS.ENABLED_KEY, true);
  
  // Load initial data from Supabase
  const fetchData = useCallback(async () => {
    if (!syncEnabled) return;
    
    try {
      setSyncStatus('syncing');
      
      let result;
      if (storeName === 'players') {
        result = await supabase.from('players').select('*');
      } else {
        // For games, we need to fetch both games and their players
        result = await supabase.from('games').select('*');
      }
      
      if (result.error) {
        throw result.error;
      }
      
      if (storeName === 'games' && result.data) {
        // Fetch the game players for each game
        const gamesWithPlayers = await Promise.all(
          result.data.map(async (game) => {
            const playersResult = await supabase
              .from('game_players')
              .select('*')
              .eq('game_id', game.id);
              
            if (playersResult.error) {
              console.error('Error fetching game players:', playersResult.error);
              return { ...game, players: [] };
            }
            
            return {
              ...game,
              players: playersResult.data
            };
          })
        );
        
        setLocalData(gamesWithPlayers as DataType<T>[]);
      } else if (result.data) {
        setLocalData(result.data as DataType<T>[]);
      }
      
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
      console.error(`Error syncing with Supabase (${storeName}):`, error);
      setSyncStatus('error');
    }
  }, [storeName, syncEnabled]);
  
  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Function to save data to Supabase
  const saveData = useCallback(async (newData: DataType<T>[]): Promise<void> => {
    if (!syncEnabled) {
      setLocalData(newData);
      return;
    }
    
    try {
      setSyncStatus('syncing');
      
      if (storeName === 'players') {
        // For players, simply upsert all records
        const { error } = await supabase
          .from('players')
          .upsert(
            newData.map(player => ({
              id: player.id,
              name: (player as any).name
            }))
          );
          
        if (error) throw error;
      } else if (storeName === 'games') {
        // For games, we need to handle the games and their players separately
        for (const game of newData) {
          const gameData = {
            id: game.id,
            date: (game as any).date,
            winningTeam: (game as any).winningTeam,
            victoryMethod: (game as any).victoryMethod
          };
          
          // Upsert the game
          const { error: gameError } = await supabase
            .from('games')
            .upsert(gameData);
            
          if (gameError) throw gameError;
          
          // Delete existing game players and insert new ones
          const { error: deleteError } = await supabase
            .from('game_players')
            .delete()
            .eq('game_id', game.id);
            
          if (deleteError) throw deleteError;
          
          // Insert new game players
          if ((game as any).players && (game as any).players.length > 0) {
            const { error: playersError } = await supabase
              .from('game_players')
              .insert(
                (game as any).players.map((player: any) => ({
                  game_id: game.id,
                  player_id: player.playerId,
                  playerName: player.playerName,
                  team: player.team,
                  heroId: player.heroId,
                  heroName: player.heroName
                }))
              );
              
            if (playersError) throw playersError;
          }
        }
      }
      
      setLocalData(newData);
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
      console.error(`Error saving to Supabase (${storeName}):`, error);
      setSyncStatus('error');
      
      // Still update local data to prevent data loss
      setLocalData(newData);
    }
  }, [storeName, syncEnabled]);
  
  // Function to manually trigger sync
  const syncNow = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  
  // Function to toggle sync
  const setSyncEnabled = useCallback((enabled: boolean) => {
    setSyncEnabledState(enabled);
    if (enabled) {
      // Trigger sync when enabled
      fetchData();
    }
  }, [setSyncEnabledState, fetchData]);
  
  return {
    data,
    setData: saveData,
    syncStatus,
    lastSynced,
    syncNow,
    setSyncEnabled,
    syncEnabled
  };
}
