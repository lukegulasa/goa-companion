
import { useState, useEffect, useCallback } from 'react';
import * as dbService from '@/lib/db';
import { Game, Player } from '@/lib/game-stats-types';

// More specific type to handle the two cases we have
type StoreData<T> = T extends 'players' ? Player : Game;

export function useIndexedDB<T extends 'players' | 'games'>(
  storeName: T,
  defaultValue: StoreData<T>[] = []
): [StoreData<T>[], (value: StoreData<T>[] | ((val: StoreData<T>[]) => StoreData<T>[])) => void] {
  const [data, setData] = useState<StoreData<T>[]>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        let items: any[];
        
        if (storeName === 'players') {
          items = await dbService.getPlayers();
        } else {
          items = await dbService.getGames();
        }
        
        setData(items as StoreData<T>[]);
      } catch (error) {
        console.error(`Error loading data from IndexedDB (${storeName}):`, error);
        // Fallback to default value if DB fails
        setData(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [storeName, defaultValue]);

  // Function to update the data
  const setItems = useCallback(async (value: StoreData<T>[] | ((val: StoreData<T>[]) => StoreData<T>[])) => {
    try {
      // Calculate the new value
      const newValue = value instanceof Function ? value(data) : value;
      
      // Update state first for UI responsiveness
      setData(newValue);
      
      // Clear existing data and add new data
      if (storeName === 'players') {
        await Promise.all([
          ...newValue.map(item => dbService.addPlayer(item as Player))
        ]);
      } else {
        // For games, we need to handle updates differently
        // First get existing games
        const existingGames = await dbService.getGames();
        const existingIds = new Set(existingGames.map(g => g.id));
        
        // Delete games that are no longer in the list
        await Promise.all(
          existingGames
            .filter(game => !newValue.some(g => g.id === game.id))
            .map(game => dbService.deleteGame(game.id))
        );
        
        // Add or update games
        await Promise.all(
          newValue.map(async (item) => {
            if (existingIds.has(item.id)) {
              return dbService.updateGame(item.id, item as Game);
            } else {
              return dbService.addGame(item as Game);
            }
          })
        );
      }
    } catch (error) {
      console.error(`Error updating IndexedDB (${storeName}):`, error);
    }
  }, [data, storeName]);

  return [data, setItems];
}
