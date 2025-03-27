import React, { useState } from 'react';
import { useCloudSync } from '@/hooks/cloud-sync';
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
import { DataPersistence } from '@/components/game-stats/data-persistence';
import { Game, GameLogFormValues, GamePlayer, NewPlayerFormValues, Player } from '@/lib/game-stats-types';

const GameStats: React.FC = () => {
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

  const onAddPlayer = (data: NewPlayerFormValues) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: data.playerName.trim(),
    };
    setPlayers([...players, newPlayer]);
  };

  const onLogGame = (data: GameLogFormValues) => {
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
  };

  const onDeleteGame = (gameId: string) => {
    setGameLogs(gameLogs.filter(game => (game as Game).id !== gameId));
  };

  const onEditGame = (gameId: string, updatedGameData: Partial<Game>) => {
    setGameLogs(gameLogs.map(game => 
      (game as Game).id === gameId 
        ? { ...game, ...updatedGameData } 
        : game
    ));
  };

  const handleDataImport = (data: { games: Game[], players: Player[] }) => {
    const existingPlayerIds = new Set(players.map(p => (p as Player).id));
    const newPlayers = [
      ...players,
      ...data.players.filter(p => !existingPlayerIds.has(p.id))
    ];
    
    const existingGameIds = new Set(gameLogs.map(g => (g as Game).id));
    const newGames = [
      ...gameLogs,
      ...data.games.filter(g => !existingGameIds.has(g.id))
    ];
    
    setPlayers(newPlayers);
    setGameLogs(newGames);
  };

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
          games={gameLogs as Game[]} 
          players={players as Player[]} 
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
