
import React from 'react';
import { GameHistory } from '@/components/game-stats/GameHistory';
import { Game } from '@/lib/game-stats-types';

interface GameHistoryTabProps {
  games: Game[];
  onDeleteGame: (gameId: string) => void;
  onEditGame: (gameId: string, updatedGame: Partial<Game>) => void;
  isAdmin: boolean;
}

export const GameHistoryTab: React.FC<GameHistoryTabProps> = ({
  games,
  onDeleteGame,
  onEditGame,
  isAdmin
}) => {
  return (
    <GameHistory 
      games={games}
      onDeleteGame={onDeleteGame}
      onEditGame={onEditGame}
      isAdmin={isAdmin}
    />
  );
};
