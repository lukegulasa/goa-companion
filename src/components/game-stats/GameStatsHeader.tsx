
import React from 'react';

interface GameStatsHeaderProps {
  isAdmin: boolean;
}

export const GameStatsHeader: React.FC<GameStatsHeaderProps> = ({ isAdmin }) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">Game Statistics</h1>
      <p className="text-muted-foreground mt-1">Track your games and player statistics</p>
      {isAdmin && (
        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-sm inline-block">
          Admin mode active - you can edit data
        </div>
      )}
    </header>
  );
};
