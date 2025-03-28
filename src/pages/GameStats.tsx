
import React, { useState, useEffect } from 'react';
import { useCloudSync } from '@/hooks/cloud-sync';
import { useHeroes } from '@/hooks/use-heroes';
import { useAuth } from '@/context/AuthContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlayerForm } from '@/components/game-stats/PlayerForm';
import { GameLogger } from '@/components/game-stats/GameLogger';
import { GameHistory } from '@/components/game-stats/GameHistory';
import { PlayerStats } from '@/components/PlayerStats';
import { DataPersistence } from '@/components/game-stats/data-persistence';
import { Game, GameLogFormValues, GamePlayer, NewPlayerFormValues, Player } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';

const GameStats: React.FC = () => {
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
    syncStatus: gamesSyncStatus,
    syncNow
  } = useCloudSync<'games'>('games', []);

  const [gameParticipants, setGameParticipants] = useState<GamePlayer[]>([]);
  const [activeTab, setActiveTab] = useState('log-game');
  const { heroes } = useHeroes();
  
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

  const onAddPlayer = (data: NewPlayerFormValues) => {
    if (!isAdmin) return;
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: data.playerName.trim(),
    };
    setPlayers([...players, newPlayer]);
  };

  const onLogGame = (data: GameLogFormValues) => {
    if (!isAdmin) return;
    
    if (gameParticipants.length < 2) {
      return;
    }
    
    if (gameParticipants.some(p => !p.heroId)) {
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

  const onDeleteGame = (gameId: string) => {
    if (!isAdmin) return;
    
    setGameLogs(gameLogs.filter(game => (game as Game).id !== gameId));
  };

  const onEditGame = (gameId: string, updatedGameData: Partial<Game>) => {
    if (!isAdmin) return;
    
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
          <PlayerForm onAddPlayer={onAddPlayer} />
          <GameLogger
            players={players as Player[]}
            heroes={heroes}
            gameParticipants={gameParticipants}
            setGameParticipants={setGameParticipants}
            onLogGame={onLogGame}
          />
        </TabsContent>
        
        <TabsContent value="game-history" className="space-y-6">
          <GameHistory 
            games={gameLogs as Game[]}
            onDeleteGame={onDeleteGame}
            onEditGame={onEditGame}
            isAdmin={isAdmin}
          />
        </TabsContent>
        
        <TabsContent value="player-stats" className="space-y-6">
          <PlayerStats players={players as Player[]} games={gameLogs as Game[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameStats;
