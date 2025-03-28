
import React from 'react';
import { Game, Player } from '@/lib/game-stats-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart } from 'lucide-react';

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
            const heroWins: Record<string, number> = {};
            
            playerGames.forEach(game => {
              const playerEntry = game.players.find(p => p.playerId === player.id);
              if (playerEntry) {
                // Track usage
                heroUsage[playerEntry.heroName] = (heroUsage[playerEntry.heroName] || 0) + 1;
                
                // Track wins
                if (playerEntry.team === game.winningTeam) {
                  heroWins[playerEntry.heroName] = (heroWins[playerEntry.heroName] || 0) + 1;
                }
              }
            });
            
            // Calculate win rates and sort heroes by usage
            const heroStats = Object.entries(heroUsage)
              .map(([hero, count]) => ({
                hero,
                count,
                wins: heroWins[hero] || 0,
                winRate: Math.round(((heroWins[hero] || 0) / count) * 100)
              }))
              .sort((a, b) => b.count - a.count)
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
                        {heroStats.map(({hero, count, winRate}) => (
                          <div key={hero} className="flex justify-between">
                            <span className="text-sm">{hero}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{count} games</span>
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                winRate >= 60 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                winRate >= 40 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}>
                                {winRate}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">No heroes played</p>
                    )}
                  </div>
                </div>
                
                {heroStats.length > 3 && (
                  <div className="mt-2">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                        Show all heroes ({Object.keys(heroUsage).length})
                      </summary>
                      <div className="mt-2 overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Hero</TableHead>
                              <TableHead>Games</TableHead>
                              <TableHead>Win Rate</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(heroUsage)
                              .map(([hero, count]) => ({
                                hero,
                                count,
                                wins: heroWins[hero] || 0,
                                winRate: Math.round(((heroWins[hero] || 0) / count) * 100)
                              }))
                              .sort((a, b) => b.count - a.count)
                              .map(({hero, count, wins, winRate}) => (
                                <TableRow key={hero}>
                                  <TableCell>{hero}</TableCell>
                                  <TableCell>{count}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded ${
                                      winRate >= 60 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                      winRate >= 40 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    }`}>
                                      {winRate}%
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      </div>
                    </details>
                  </div>
                )}
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
