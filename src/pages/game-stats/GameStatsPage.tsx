
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { DataPersistence } from '@/components/game-stats/data-persistence';
import { GameLoggerTab } from './tabs/GameLoggerTab';
import { GameHistoryTab } from './tabs/GameHistoryTab';
import { PlayerStatsTab } from './tabs/PlayerStatsTab';
import { GameStatsHeader } from '@/components/game-stats/GameStatsHeader';
import { SyncStatusNotifications } from '@/components/game-stats/SyncStatusNotifications';
import { useGameStats } from '@/hooks/use-game-stats';
import { useIsMobile } from '@/hooks/use-mobile';

const GameStatsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('game-history');
  const isMobile = useIsMobile();
  
  const {
    players,
    gameLogs,
    gameParticipants,
    setGameParticipants,
    playersSyncStatus,
    gamesSyncStatus,
    handleAddPlayer,
    handleLogGame,
    handleDeleteGame,
    handleEditGame
  } = useGameStats();

  // Handler wrappers that include isAdmin
  const onAddPlayer = (data: any) => handleAddPlayer(data, isAdmin);
  const onLogGame = (data: any) => {
    const success = handleLogGame(data, isAdmin);
    if (success) setActiveTab('game-history');
    return success;
  };
  const onDeleteGame = (gameId: string) => handleDeleteGame(gameId, isAdmin);
  const onEditGame = (gameId: string, updatedGame: any) => handleEditGame(gameId, updatedGame, isAdmin);

  return (
    <div className={`container mx-auto ${isMobile ? 'px-0 py-2' : 'py-8 px-4 sm:px-6'} max-w-6xl`}>
      <GameStatsHeader isAdmin={isAdmin} />
      
      <SyncStatusNotifications 
        playersSyncStatus={playersSyncStatus}
        gamesSyncStatus={gamesSyncStatus}
      />
      
      <div className={isMobile ? "mb-2 px-2" : "mb-6"}>
        <DataPersistence />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className={`space-y-2 ${isMobile ? 'px-2' : ''}`}>
        <TabsList className="w-full">
          <TabsTrigger value="game-history" className="flex-1">Game History</TabsTrigger>
          <TabsTrigger value="player-stats" className="flex-1">Player Stats</TabsTrigger>
          <TabsTrigger value="log-game" className="flex-1">Log a Game</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game-history" className={`space-y-4 ${isMobile ? 'px-0' : ''}`}>
          <GameHistoryTab 
            games={gameLogs}
            onDeleteGame={onDeleteGame}
            onEditGame={onEditGame}
            isAdmin={isAdmin}
          />
        </TabsContent>
        
        <TabsContent value="player-stats" className="space-y-4">
          <PlayerStatsTab 
            players={players} 
            games={gameLogs} 
          />
        </TabsContent>

        <TabsContent value="log-game" className="space-y-6">
          <GameLoggerTab 
            players={players} 
            gameParticipants={gameParticipants}
            setGameParticipants={setGameParticipants}
            onAddPlayer={onAddPlayer} 
            onLogGame={onLogGame}
            isAdmin={isAdmin}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameStatsPage;
