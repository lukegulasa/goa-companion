
import { Game, HeroStats, HeroMatchupStats, HeroSynergyStats } from '@/lib/game-stats-types';
import { Hero } from '@/lib/types';

/**
 * Calculate hero win rates from game logs
 */
export function calculateHeroStats(games: Game[]): HeroStats[] {
  const stats: Record<number, HeroStats> = {};

  // Process each game
  games.forEach(game => {
    game.players.forEach(player => {
      const heroId = player.heroId;
      
      // Initialize hero stats if not exists
      if (!stats[heroId]) {
        stats[heroId] = {
          heroId,
          heroName: player.heroName,
          gamesPlayed: 0,
          wins: 0,
          winRate: 0
        };
      }
      
      // Update stats
      stats[heroId].gamesPlayed++;
      if (player.team === game.winningTeam) {
        stats[heroId].wins++;
      }
    });
  });

  // Calculate win rates
  Object.values(stats).forEach(hero => {
    hero.winRate = hero.gamesPlayed > 0 
      ? Math.round((hero.wins / hero.gamesPlayed) * 100) 
      : 0;
  });

  return Object.values(stats);
}

/**
 * Calculate hero matchup stats (win rates against other heroes)
 */
export function calculateHeroMatchups(games: Game[]): HeroMatchupStats[] {
  const matchups: Record<string, HeroMatchupStats> = {};

  // Process each game
  games.forEach(game => {
    // Group players by team
    const redTeam = game.players.filter(p => p.team === 'Red');
    const blueTeam = game.players.filter(p => p.team === 'Blue');
    
    // Calculate matchups between opposing teams
    redTeam.forEach(redPlayer => {
      blueTeam.forEach(bluePlayer => {
        // Create unique key for this matchup
        const redWins = game.winningTeam === 'Red';
        
        // Track both directions of the matchup
        updateMatchupStats(matchups, redPlayer.heroId, bluePlayer.heroId, redWins);
        updateMatchupStats(matchups, bluePlayer.heroId, redPlayer.heroId, !redWins);
      });
    });
  });

  // Calculate win rates
  return Object.values(matchups);
}

/**
 * Calculate hero synergy stats (win rates when paired with other heroes)
 */
export function calculateHeroSynergies(games: Game[]): HeroSynergyStats[] {
  const synergies: Record<string, HeroSynergyStats> = {};

  // Process each game
  games.forEach(game => {
    // Process each team separately
    ['Red', 'Blue'].forEach(team => {
      const teamPlayers = game.players.filter(p => p.team === team);
      const teamWon = game.winningTeam === team;
      
      // Calculate synergies between all heroes on the same team
      for (let i = 0; i < teamPlayers.length; i++) {
        for (let j = i + 1; j < teamPlayers.length; j++) {
          const hero1 = teamPlayers[i];
          const hero2 = teamPlayers[j];
          
          // Track synergy in both directions
          updateSynergyStats(synergies, hero1.heroId, hero2.heroId, teamWon);
          updateSynergyStats(synergies, hero2.heroId, hero1.heroId, teamWon);
        }
      }
    });
  });

  // Calculate win rates
  return Object.values(synergies);
}

/**
 * Helper function to update matchup stats
 */
function updateMatchupStats(
  matchups: Record<string, HeroMatchupStats>, 
  heroId: number, 
  opponentId: number, 
  didWin: boolean
) {
  const key = `${heroId}-${opponentId}`;
  
  if (!matchups[key]) {
    matchups[key] = {
      heroId,
      opponentId,
      gamesPlayed: 0,
      wins: 0,
      winRate: 0
    };
  }
  
  matchups[key].gamesPlayed++;
  if (didWin) {
    matchups[key].wins++;
  }
  
  // Update win rate
  matchups[key].winRate = Math.round((matchups[key].wins / matchups[key].gamesPlayed) * 100);
}

/**
 * Helper function to update synergy stats
 */
function updateSynergyStats(
  synergies: Record<string, HeroSynergyStats>, 
  heroId: number, 
  allyId: number, 
  didWin: boolean
) {
  const key = `${heroId}-${allyId}`;
  
  if (!synergies[key]) {
    synergies[key] = {
      heroId,
      allyId,
      gamesPlayed: 0,
      wins: 0,
      winRate: 0
    };
  }
  
  synergies[key].gamesPlayed++;
  if (didWin) {
    synergies[key].wins++;
  }
  
  // Update win rate
  synergies[key].winRate = Math.round((synergies[key].wins / synergies[key].gamesPlayed) * 100);
}

/**
 * Get hero stats by hero ID
 */
export function getHeroStats(heroId: number, heroStats: HeroStats[]): HeroStats | undefined {
  return heroStats.find(stats => stats.heroId === heroId);
}

/**
 * Get hero matchups for a specific hero
 */
export function getHeroMatchups(heroId: number, matchups: HeroMatchupStats[]): HeroMatchupStats[] {
  return matchups.filter(matchup => matchup.heroId === heroId);
}

/**
 * Get hero synergies for a specific hero
 */
export function getHeroSynergies(heroId: number, synergies: HeroSynergyStats[]): HeroSynergyStats[] {
  return synergies.filter(synergy => synergy.heroId === heroId);
}

/**
 * Get win rate for a specific hero
 */
export function getHeroWinRate(heroId: number, heroStats: HeroStats[]): number | null {
  const stats = getHeroStats(heroId, heroStats);
  return stats ? stats.winRate : null;
}
