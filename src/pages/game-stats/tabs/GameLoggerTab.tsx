
import React from 'react';
import { PlayerForm } from '@/components/game-stats/PlayerForm';
import { GameLogger } from '@/components/game-stats/GameLogger';
import { GameLogFormValues, GamePlayer, NewPlayerFormValues, Player } from '@/lib/game-stats-types';
import { useHeroes } from '@/hooks/use-heroes';

interface GameLoggerTabProps {
  players: Player[];
  gameParticipants: GamePlayer[];
  setGameParticipants: React.Dispatch<React.SetStateAction<GamePlayer[]>>;
  onAddPlayer: (data: NewPlayerFormValues) => void;
  onLogGame: (data: GameLogFormValues) => void;
  isAdmin: boolean;
}

export const GameLoggerTab: React.FC<GameLoggerTabProps> = ({
  players,
  gameParticipants,
  setGameParticipants,
  onAddPlayer,
  onLogGame,
  isAdmin
}) => {
  const { heroes } = useHeroes();

  return (
    <>
      <PlayerForm onAddPlayer={onAddPlayer} />
      <GameLogger
        players={players}
        heroes={heroes}
        gameParticipants={gameParticipants}
        setGameParticipants={setGameParticipants}
        onLogGame={onLogGame}
      />
    </>
  );
};
