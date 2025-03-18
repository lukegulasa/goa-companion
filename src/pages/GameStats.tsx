
import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useHeroes } from '@/hooks/use-heroes';
import { GalleryProvider } from '@/context/GalleryContext';
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
import { Game, GameLogFormValues, GamePlayer, NewPlayerFormValues, Player } from '@/lib/game-stats-types';

const GameStatsContent: React.FC = () => {
  const [players, setPlayers] = useLocalStorage<Player[]>('game-players', []);
  const [gameLogs, setGameLogs] = useLocalStorage<Game[]>('game-logs', []);
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

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Game Statistics</h1>
        <p className="text-muted-foreground mt-1">Track your games and player statistics</p>
      </header>
      
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
          <GameHistory games={gameLogs} />
        </TabsContent>
        
        <TabsContent value="player-stats" className="space-y-6">
          <PlayerStats players={players} games={gameLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const GameStats: React.FC = () => {
  return (
    <GalleryProvider>
      <GameStatsContent />
    </GalleryProvider>
  );
};

export default GameStats;
