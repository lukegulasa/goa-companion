
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeroWinRateProps {
  winRate: number;
  gamesPlayed: number;
  showDetails?: boolean;
}

export const HeroWinRate: React.FC<HeroWinRateProps> = ({ 
  winRate, 
  gamesPlayed,
  showDetails = false 
}) => {
  // Determine color based on win rate
  const getWinRateColor = (rate: number) => {
    if (rate >= 60) return 'bg-green-500 hover:bg-green-600';
    if (rate >= 45) return 'bg-blue-500 hover:bg-blue-600';
    return 'bg-red-500 hover:bg-red-600';
  };
  
  // If no games played, return neutral badge
  if (gamesPlayed === 0) {
    return (
      <Badge variant="outline" className="text-xs">
        No data
      </Badge>
    );
  }
  
  return (
    <Badge className={`${getWinRateColor(winRate)} text-white`}>
      {winRate}%
      {showDetails && gamesPlayed > 0 && (
        <span className="ml-1 opacity-80">({gamesPlayed})</span>
      )}
    </Badge>
  );
};
