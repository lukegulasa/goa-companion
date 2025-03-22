
// Re-export all functionality from the new modules
// This maintains backward compatibility with existing code

export { 
  calculatePlayerStrength,
  getPlayerStats,
  type PlayerWithStats
} from './team-balance/player-stats';

export {
  generate2v2Combinations,
  generate3v3Combinations
} from './team-balance/team-combinations';

export {
  findBalancedTeams
} from './team-balance/team-balancer';

export { type TeamConfig } from './team-balance/types';
