
import { useState } from 'react';
import { useCloudSync } from '@/hooks/cloud-sync';
import { useToast } from '@/hooks/use-toast';
import { Game, GameLogFormValues, GamePlayer, NewPlayerFormValues, Player } from '@/lib/game-stats-types';

export function useGameStats() {
  const { toast } = useToast();
  
  const { 
    data: players, 
    setData: setPlayers,
    syncStatus: playersSyncStatus
  } = useCloudSync<'players'>('players', []);

  const { 
    data: gameLogs, 
    setData: setGameLogs,
    syncStatus: gamesSyncStatus
  } = useCloudSync<'games'>('games', []);

  const [gameParticipants, setGameParticipants] = useState<GamePlayer[]>([]);
  
  // Handler for adding a new player
  const handleAddPlayer = (data: NewPlayerFormValues, isAdmin: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You need admin privileges to add players.",
        variant: "destructive"
      });
      return;
    }
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: data.playerName.trim(),
    };
    setPlayers([...players, newPlayer]);
    
    toast({
      title: "Player Added",
      description: `${data.playerName.trim()} has been added to the players list.`
    });
  };

  // Handler for logging a new game
  const handleLogGame = (data: GameLogFormValues, isAdmin: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You need admin privileges to log games.",
        variant: "destructive"
      });
      return false;
    }
    
    if (gameParticipants.length < 2) {
      toast({
        title: "Not Enough Players",
        description: "You need at least 2 players to log a game.",
        variant: "destructive"
      });
      return false;
    }
    
    if (gameParticipants.some(p => !p.heroId)) {
      toast({
        title: "Missing Hero Selection",
        description: "All players must have a hero selected.",
        variant: "destructive"
      });
      return false;
    }
    
    const newGame: Game = {
      id: Date.now().toString(),
      date: data.date.toISOString(),
      players: gameParticipants,
      winningTeam: data.winningTeam,
      victoryMethod: data.victoryMethod,
    };
    
    setGameLogs([...gameLogs, newGame]);
    setGameParticipants([]);
    
    toast({
      title: "Game Logged",
      description: "Your game has been successfully saved to the database."
    });
    return true;
  };

  // Handler for deleting a game
  const handleDeleteGame = (gameId: string, isAdmin: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You need admin privileges to delete games.",
        variant: "destructive"
      });
      return;
    }
    
    setGameLogs(gameLogs.filter(game => (game as Game).id !== gameId));
  };

  // Handler for editing a game
  const handleEditGame = (gameId: string, updatedGameData: Partial<Game>, isAdmin: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You need admin privileges to edit games.",
        variant: "destructive"
      });
      return;
    }
    
    setGameLogs(gameLogs.map(game => 
      (game as Game).id === gameId 
        ? { ...game, ...updatedGameData } 
        : game
    ));
  };

  return {
    players: players as Player[],
    gameLogs: gameLogs as Game[],
    gameParticipants,
    setGameParticipants,
    playersSyncStatus,
    gamesSyncStatus,
    handleAddPlayer,
    handleLogGame,
    handleDeleteGame,
    handleEditGame
  };
}
