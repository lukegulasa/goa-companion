
import React from 'react';
import { HeroWinRate } from '@/components/HeroWinRate';
import { HeroStats } from '@/lib/game-stats-types';

interface HeroModalWinRateProps {
  heroStat?: HeroStats;
  gamesLogged: number;
}

export const HeroModalWinRate: React.FC<HeroModalWinRateProps> = ({ 
  heroStat, 
  gamesLogged 
}) => {
  if (gamesLogged === 0) return null;
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-sm font-medium">Win Rate</h3>
      <div className="flex items-center gap-2">
        <HeroWinRate 
          winRate={heroStat?.winRate || 0} 
          gamesPlayed={heroStat?.gamesPlayed || 0}
          showDetails={true}
        />
      </div>
    </div>
  );
};
