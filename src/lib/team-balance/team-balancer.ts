
import { PlayerWithStats } from './player-stats';
import { TeamConfig } from './types';
import { generate2v2Combinations, generate3v3Combinations } from './team-combinations';

// Find the most balanced team configuration
export const findBalancedTeams = (players: PlayerWithStats[]): TeamConfig => {
  if (players.length !== 4 && players.length !== 6) {
    throw new Error('Team balancing requires exactly 4 or 6 players');
  }
  
  const combinations = players.length === 4 
    ? generate2v2Combinations(players) 
    : generate3v3Combinations(players);
  
  // Sort by strength difference (ascending)
  combinations.sort((a, b) => a.strengthDifference - b.strengthDifference);
  
  // Return the most balanced configuration
  return combinations[0];
};
