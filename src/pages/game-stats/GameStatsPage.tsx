
import React, { useState, useEffect } from 'react';
import { useCloudSync } from '@/hooks/cloud-sync';
import { useAuth } from '@/context/AuthContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { DataPersistence } from '@/components/game-stats/data-persistence';
import { Game, GameLogFormValues, GamePlayer, NewPlayerFormValues, Player } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';
import { GameLoggerTab } from './tabs/GameLoggerTab';
import { GameHistoryTab } from './tabs/GameHistoryTab';
import { PlayerStatsTab } from './tabs/PlayerStatsTab';

const GameStatsPage: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
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
  const [activeTab, setActiveTab] = useState('log-game');
  
  // Show toast notification when sync status changes
  useEffect(() => {
    if (playersSyncStatus === 'error' || gamesSyncStatus === 'error') {
      toast({
        title: "Sync Error",
        description: "There was an error syncing with the database. Please try again later.",
        variant: "destructive"
      });
    } else if (playersSyncStatus === 'synced' && gamesSyncStatus === 'synced') {
      toast({
        title: "Sync Complete",
        description: "Your game data has been synced with the database."
      });
    }
  }, [playersSyncStatus, gamesSyncStatus, toast]);

  // Handler functions
  const handleAddPlayer = (data: NewPlayerFormValues) => {
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

  const handleLogGame = (data: GameLogFormValues) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You need admin privileges to log games.",
        variant: "destructive"
      });
      return;
    }
    
    if (gameParticipants.length < 2) {
      toast({
        title: "Not Enough Players",
        description: "You need at least 2 players to log a game.",
        variant: "destructive"
      });
      return;
    }
    
    if (gameParticipants.some(p => !p.heroId)) {
      toast({
        title: "Missing Hero Selection",
        description: "All players must have a hero selected.",
        variant: "destructive"
      });
      return;
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
    setActiveTab('game-history');
    
    toast({
      title: "Game Logged",
      description: "Your game has been successfully saved to the database."
    });
  };

  const handleDeleteGame = (gameId: string) => {
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

  const handleEditGame = (gameId: string, updatedGameData: Partial<Game>) => {
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

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Game Statistics</h1>
        <p className="text-muted-foreground mt-1">Track your games and player statistics</p>
        {isAdmin && (
          <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-sm inline-block">
            Admin mode active - you can edit data
          </div>
        )}
      </header>
      
      <div className="mb-8">
        <DataPersistence />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="log-game">Log a Game</TabsTrigger>
          <TabsTrigger value="game-history">Game History</TabsTrigger>
          <TabsTrigger value="player-stats">Player Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="log-game" className="space-y-8">
          <GameLoggerTab 
            players={players as Player[]} 
            gameParticipants={gameParticipants}
            setGameParticipants={setGameParticipants}
            onAddPlayer={handleAddPlayer} 
            onLogGame={handleLogGame}
            isAdmin={isAdmin}
          />
        </TabsContent>
        
        <TabsContent value="game-history" className="space-y-6">
          <GameHistoryTab 
            games={gameLogs as Game[]}
            onDeleteGame={handleDeleteGame}
            onEditGame={handleEditGame}
            isAdmin={isAdmin}
          />
        </TabsContent>
        
        <TabsContent value="player-stats" className="space-y-6">
          <PlayerStatsTab 
            players={players as Player[]} 
            games={gameLogs as Game[]} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameStatsPage;
