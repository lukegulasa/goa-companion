
import { Player, Game } from '@/lib/game-stats-types';

export interface PlayerWithStats {
  id: string;
  name: string;
  gamesPlayed: number;
  winRate: number;
  weightedStrength: number;
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
