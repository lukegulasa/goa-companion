
import { PlayerWithStats } from './player-stats';

export interface TeamConfig {
  teamA: PlayerWithStats[];
  teamB: PlayerWithStats[];
  teamAStrength: number;
  teamBStrength: number;
  strengthDifference: number;
}
