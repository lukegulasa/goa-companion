
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CloudSyncResult, DataType, SyncStatus, SYNC_CONSTANTS } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { fetchCloudData, pushToCloud, setupCloudListener } from './utils';

export function useCloudSync<T extends 'players' | 'games'>(
  storeName: T,
  defaultValue: DataType<T>[] = [] as DataType<T>[]
): CloudSyncResult<T> {
  const [data, setLocalData] = useState<DataType<T>[]>(defaultValue);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncEnabled, setSyncEnabledState] = useLocalStorage(SYNC_CONSTANTS.ENABLED_KEY, true);
  
  // Load initial data from Supabase
  const fetchInitialData = useCallback(async () => {
    if (!syncEnabled) return;
    
    try {
      setSyncStatus('syncing');
      
      const { data: cloudData } = await fetchCloudData(storeName);
      
      // If we have cloud data, use it
      if (cloudData && cloudData.length > 0) {
        // Transform data from Supabase's column names to our application's property names
        if (storeName === 'games') {
          const transformedGames = cloudData.map((game: any) => ({
            id: game.id,
            date: game.date,
            winningTeam: game.winningteam, // Note: capitalize for app
            victoryMethod: game.victorymethod, // Note: capitalize for app
            // We'll fetch players separately
            players: []
          }));
          
          // For games, fetch the related players
          for (const game of transformedGames) {
            const { data: playerData } = await supabase
              .from('game_players')
              .select('*')
              .eq('game_id', game.id);
              
            if (playerData) {
              game.players = playerData.map((p: any) => ({
                playerId: p.player_id,
                playerName: p.playername,
                team: p.team,
                heroId: p.heroid,
                heroName: p.heroname
              }));
            }
          }
          
          setLocalData(transformedGames as DataType<T>[]);
        } else {
          // For players, we can use the data directly
          setLocalData(cloudData as DataType<T>[]);
        }
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
    fetchInitialData();
  }, [fetchInitialData]);
  
  // Set up real-time listener for changes
  useEffect(() => {
    if (!syncEnabled) return;
    
    const cleanupListener = setupCloudListener(storeName, fetchInitialData);
    
    return () => {
      cleanupListener();
    };
  }, [storeName, syncEnabled, fetchInitialData]);
  
  // Function to save data to Supabase
  const saveData = useCallback(async (newData: DataType<T>[]): Promise<void> => {
    if (!syncEnabled) {
      setLocalData(newData);
      return;
    }
    
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
  }, [storeName, syncEnabled]);
  
  // Function to manually trigger sync
  const syncNow = useCallback(async () => {
    await fetchInitialData();
  }, [fetchInitialData]);
  
  // Function to toggle sync
  const setSyncEnabled = useCallback((enabled: boolean) => {
    setSyncEnabledState(enabled);
    if (enabled) {
      // Trigger sync when enabled
      fetchInitialData();
    }
  }, [setSyncEnabledState, fetchInitialData]);
  
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

