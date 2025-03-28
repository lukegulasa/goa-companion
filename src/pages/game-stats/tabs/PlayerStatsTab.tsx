
import React from 'react';
import { PlayerStats } from '@/components/PlayerStats';
import { Game, Player } from '@/lib/game-stats-types';

interface PlayerStatsTabProps {
  players: Player[];
  games: Game[];
}

export const PlayerStatsTab: React.FC<PlayerStatsTabProps> = ({
  players,
  games
}) => {
  return (
    <PlayerStats players={players} games={games} />
  );
};
