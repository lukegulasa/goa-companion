
import { supabase } from '@/integrations/supabase/client';
import { DataType } from './types';

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
    
    // For games, fetch the related players
    if (store === 'games' && result.data) {
      for (const game of result.data) {
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
        } else {
          game.players = [];
        }
        
        // Transform database column names to match our application names
        game.winningTeam = game.winningteam;
        game.victoryMethod = game.victorymethod;
      }
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
          winningteam: (game as any).winningTeam,
          victorymethod: (game as any).victoryMethod
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
