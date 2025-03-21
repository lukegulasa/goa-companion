
import { useLocalStorage } from '@/hooks/use-local-storage';
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
  const [gameLogs] = useLocalStorage<Game[]>('game-logs', []);
  
  // Calculate hero stats from game logs
  const heroStats = useMemo(() => calculateHeroStats(gameLogs), [gameLogs]);
  
  // Calculate hero matchups
  const heroMatchups = useMemo(() => calculateHeroMatchups(gameLogs), [gameLogs]);
  
  // Calculate hero synergies
  const heroSynergies = useMemo(() => calculateHeroSynergies(gameLogs), [gameLogs]);
  
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
