
import React from 'react';
import { Game, Player } from '@/lib/game-stats-types';

interface PlayerStatsProps {
  players: Player[];
  games: Game[];
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ players, games }) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Player Statistics</h2>
      
      {players.length > 0 ? (
        <div className="space-y-8">
          {players.map((player) => {
            // Calculate player stats
            const playerGames = games.filter(game => 
              game.players.some(p => p.playerId === player.id)
            );
            
            const gamesWon = playerGames.filter(game => {
              const playerEntry = game.players.find(p => p.playerId === player.id);
              return playerEntry && playerEntry.team === game.winningTeam;
            });
            
            // Get hero usage stats
            const heroUsage: Record<string, number> = {};
            playerGames.forEach(game => {
              const playerEntry = game.players.find(p => p.playerId === player.id);
              if (playerEntry) {
                heroUsage[playerEntry.heroName] = (heroUsage[playerEntry.heroName] || 0) + 1;
              }
            });
            
            // Sort heroes by usage
            const heroStats = Object.entries(heroUsage)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3);
              
            return (
              <div key={player.id} className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-2">{player.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-background rounded-md">
                    <p className="text-sm text-muted-foreground">Games Played</p>
                    <p className="text-2xl font-bold">{playerGames.length}</p>
                  </div>
                  
                  <div className="p-3 bg-background rounded-md">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold">
                      {playerGames.length > 0 
                        ? `${Math.round((gamesWon.length / playerGames.length) * 100)}%`
                        : '0%'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-background rounded-md">
                    <p className="text-sm text-muted-foreground">Most Played Heroes</p>
                    {heroStats.length > 0 ? (
                      <div className="mt-1 space-y-1">
                        {heroStats.map(([hero, count]) => (
                          <div key={hero} className="flex justify-between">
                            <span className="text-sm">{hero}</span>
                            <span className="text-sm font-medium">{count} games</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">No heroes played</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">No players added yet.</p>
        </div>
      )}
    </div>
  );
};
