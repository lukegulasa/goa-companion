
import { Player, Game } from '@/lib/game-stats-types';

export interface PlayerWithStats {
  id: string;
  name: string;
  gamesPlayed: number;
  winRate: number;
  weightedStrength: number;
}

export interface TeamConfig {
  teamA: PlayerWithStats[];
  teamB: PlayerWithStats[];
  teamAStrength: number;
  teamBStrength: number;
  strengthDifference: number;
}

// Calculate a player's weighted strength based on win rate and games played
export const calculatePlayerStrength = (winRate: number, gamesPlayed: number): number => {
  return winRate * (1 + Math.log(gamesPlayed + 1));
};

// Calculate player stats from game history
export const getPlayerStats = (players: Player[], games: Game[]): PlayerWithStats[] => {
  return players.map(player => {
    // Find all games this player participated in
    const playerGames = games.filter(game => 
      game.players.some(p => p.playerId === player.id)
    );
    
    // Calculate number of games played
    const gamesPlayed = playerGames.length;
    
    // Calculate win rate
    let wins = 0;
    playerGames.forEach(game => {
      // Find which team the player was on in this game
      const playerTeam = game.players.find(p => p.playerId === player.id)?.team;
      // Check if player's team won
      if (playerTeam === game.winningTeam) {
        wins++;
      }
    });
    
    const winRate = gamesPlayed > 0 ? wins / gamesPlayed : 0;
    const weightedStrength = calculatePlayerStrength(winRate, gamesPlayed);
    
    return {
      id: player.id,
      name: player.name,
      gamesPlayed,
      winRate,
      weightedStrength
    };
  });
};

// Generate all possible team combinations for 2v2 (4 players)
const generate2v2Combinations = (players: PlayerWithStats[]): TeamConfig[] => {
  if (players.length !== 4) {
    throw new Error('Need exactly 4 players for 2v2 combinations');
  }
  
  const combinations: TeamConfig[] = [];
  
  // We only need to generate 3 combinations for 4 players
  // [0,1] vs [2,3]
  // [0,2] vs [1,3]
  // [0,3] vs [1,2]
  
  const teamConfigs = [
    { teamA: [0, 1], teamB: [2, 3] },
    { teamA: [0, 2], teamB: [1, 3] },
    { teamA: [0, 3], teamB: [1, 2] }
  ];
  
  teamConfigs.forEach(config => {
    const teamA = config.teamA.map(idx => players[idx]);
    const teamB = config.teamB.map(idx => players[idx]);
    
    const teamAStrength = teamA.reduce((sum, player) => sum + player.weightedStrength, 0);
    const teamBStrength = teamB.reduce((sum, player) => sum + player.weightedStrength, 0);
    const strengthDifference = Math.abs(teamAStrength - teamBStrength);
    
    combinations.push({
      teamA,
      teamB,
      teamAStrength,
      teamBStrength,
      strengthDifference
    });
  });
  
  return combinations;
};

// Generate all possible team combinations for 3v3 (6 players)
const generate3v3Combinations = (players: PlayerWithStats[]): TeamConfig[] => {
  if (players.length !== 6) {
    throw new Error('Need exactly 6 players for 3v3 combinations');
  }
  
  const combinations: TeamConfig[] = [];
  
  // Generate all possible 3-player combinations from 6 players
  // There are 20 ways to choose 3 players from 6 players
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      for (let k = j + 1; k < 6; k++) {
        // Team A is [i, j, k]
        // Team B is all other players
        const teamAIndices = [i, j, k];
        const teamBIndices = [0, 1, 2, 3, 4, 5].filter(idx => !teamAIndices.includes(idx));
        
        const teamA = teamAIndices.map(idx => players[idx]);
        const teamB = teamBIndices.map(idx => players[idx]);
        
        const teamAStrength = teamA.reduce((sum, player) => sum + player.weightedStrength, 0);
        const teamBStrength = teamB.reduce((sum, player) => sum + player.weightedStrength, 0);
        const strengthDifference = Math.abs(teamAStrength - teamBStrength);
        
        combinations.push({
          teamA,
          teamB,
          teamAStrength,
          teamBStrength,
          strengthDifference
        });
      }
    }
  }
  
  return combinations;
};

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
