
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameStatsHeaderProps {
  isAdmin: boolean;
}

export const GameStatsHeader: React.FC<GameStatsHeaderProps> = ({ isAdmin }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className={`mb-4 ${isMobile ? '' : 'mb-8'}`}>
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-roboto font-bold tracking-tight`}>Game Statistics</h1>
      <p className="text-muted-foreground mt-1 text-sm">Track your games and player statistics</p>
      {isAdmin && (
        <div className={`mt-2 p-2 ${isMobile ? 'text-xs p-1.5' : 'text-sm p-2'} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md inline-block`}>
          Admin mode active - you can edit data
        </div>
      )}
    </header>
  );
};
