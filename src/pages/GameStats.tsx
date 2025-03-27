
import React, { useState } from 'react';
import { useCloudSync } from '@/hooks/use-cloud-sync';
import { useHeroes } from '@/hooks/use-heroes';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PlayerForm } from '@/components/game-stats/PlayerForm';
import { GameLogger } from '@/components/game-stats/GameLogger';
import { GameHistory } from '@/components/game-stats/GameHistory';
import { PlayerStats } from '@/components/game-stats/PlayerStats';
import { DataPersistence } from '@/components/game-stats/DataPersistence';
import { Game, GameLogFormValues, GamePlayer, NewPlayerFormValues, Player } from '@/lib/game-stats-types';

const GameStats: React.FC = () => {
  // Replace IndexedDB with Cloud Sync hook
  const { 
    data: players, 
    setData: setPlayers,
    syncStatus: playersSyncStatus,
    lastSynced: playersLastSynced,
    syncNow: syncPlayersNow,
    syncEnabled,
    setSyncEnabled
  } = useCloudSync<'players'>('players', []);

  const { 
    data: gameLogs, 
    setData: setGameLogs,
    syncStatus: gamesSyncStatus,
    lastSynced: gamesLastSynced,
    syncNow: syncGamesNow
  } = useCloudSync<'games'>('games', []);

  const [gameParticipants, setGameParticipants] = useState<GamePlayer[]>([]);
  const [activeTab, setActiveTab] = useState('log-game');
  const { heroes } = useHeroes();

  // Add a new player
  const onAddPlayer = (data: NewPlayerFormValues) => {
    const newPlayer = {
      id: Date.now().toString(),
      name: data.playerName.trim(),
    };
    setPlayers([...players, newPlayer]);
  };

  // Log a new game
  const onLogGame = (data: GameLogFormValues) => {
    // Validate that we have players and they all have heroes selected
    if (gameParticipants.length < 2) {
      return; // Need at least 2 players
    }
    
    if (gameParticipants.some(p => !p.heroId)) {
      return; // All players need a hero
    }
    
    const newGame: Game = {
      id: Date.now().toString(),
      date: data.date.toISOString(),
      players: gameParticipants,
      winningTeam: data.winningTeam,
      victoryMethod: data.victoryMethod,
    };
    
    setGameLogs([...gameLogs, newGame]);
    
    // Reset the form
    setGameParticipants([]);
    setActiveTab('game-history');
  };

  // Delete a game
  const onDeleteGame = (gameId: string) => {
    setGameLogs(gameLogs.filter(game => game.id !== gameId));
  };

  // Edit a game
  const onEditGame = (gameId: string, updatedGameData: Partial<Game>) => {
    setGameLogs(gameLogs.map(game => 
      game.id === gameId 
        ? { ...game, ...updatedGameData } 
        : game
    ));
  };

  // Handle importing data
  const handleDataImport = (data: { games: Game[], players: Player[] }) => {
    // Merge players (avoid duplicates based on id)
    const existingPlayerIds = new Set(players.map(p => p.id));
    const newPlayers = [
      ...players,
      ...data.players.filter(p => !existingPlayerIds.has(p.id))
    ];
    
    // Merge games (avoid duplicates based on id)
    const existingGameIds = new Set(gameLogs.map(g => g.id));
    const newGames = [
      ...gameLogs,
      ...data.games.filter(g => !existingGameIds.has(g.id))
    ];
    
    setPlayers(newPlayers);
    setGameLogs(newGames);
  };

  // Force sync both data types
  const syncAllData = async () => {
    await Promise.all([syncPlayersNow(), syncGamesNow()]);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Game Statistics</h1>
        <p className="text-muted-foreground mt-1">Track your games and player statistics</p>
      </header>
      
      <div className="mb-8">
        <DataPersistence 
          games={gameLogs} 
          players={players} 
          onImport={handleDataImport}
          syncStatus={playersSyncStatus !== 'error' && gamesSyncStatus !== 'error' 
            ? playersSyncStatus 
            : 'error'}
          lastSynced={playersLastSynced}
          onSyncNow={syncAllData}
          syncEnabled={syncEnabled}
          onToggleSync={setSyncEnabled}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="log-game">Log a Game</TabsTrigger>
          <TabsTrigger value="game-history">Game History</TabsTrigger>
          <TabsTrigger value="player-stats">Player Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="log-game" className="space-y-8">
          {/* New Player Form */}
          <PlayerForm onAddPlayer={onAddPlayer} />

          {/* Game Logger */}
          <GameLogger
            players={players}
            heroes={heroes}
            gameParticipants={gameParticipants}
            setGameParticipants={setGameParticipants}
            onLogGame={onLogGame}
          />
        </TabsContent>
        
        <TabsContent value="game-history" className="space-y-6">
          <GameHistory 
            games={gameLogs}
            onDeleteGame={onDeleteGame}
            onEditGame={onEditGame}
          />
        </TabsContent>
        
        <TabsContent value="player-stats" className="space-y-6">
          <PlayerStats players={players} games={gameLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameStats;
