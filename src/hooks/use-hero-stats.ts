
import { useCloudSync } from '@/hooks/cloud-sync';
import { Game } from '@/lib/game-stats-types';
import { 
  calculateHeroStats, 
  calculateHeroMatchups, 
  calculateHeroSynergies,
  getHeroStats,
  getHeroMatchups,
  getHeroSynergies,
  getHeroWinRate
} from '@/lib/hero-stats-utils';
import { useMemo } from 'react';

export function useHeroStats() {
  // Use cloud data instead of localStorage
  const { data: gameLogs } = useCloudSync<'games'>('games', []);
  
  // Calculate hero stats from game logs
  const heroStats = useMemo(() => calculateHeroStats(gameLogs as Game[]), [gameLogs]);
  
  // Calculate hero matchups
  const heroMatchups = useMemo(() => calculateHeroMatchups(gameLogs as Game[]), [gameLogs]);
  
  // Calculate hero synergies
  const heroSynergies = useMemo(() => calculateHeroSynergies(gameLogs as Game[]), [gameLogs]);
  
  return {
    heroStats,
    heroMatchups,
    heroSynergies,
    gamesLogged: gameLogs.length
  };
}

// Export additional utility functions for easy access
export {
  getHeroStats,
  getHeroMatchups,
  getHeroSynergies,
  getHeroWinRate
};
