
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HeroWinRate } from '@/components/HeroWinRate';
import { HeroMatchupStats, HeroSynergyStats } from '@/lib/game-stats-types';
import { Hero } from '@/lib/types';

interface HeroModalPerformanceProps {
  matchups: HeroMatchupStats[];
  synergies: HeroSynergyStats[];
  gamesLogged: number;
  heroes: Hero[];
}

export const HeroModalPerformance: React.FC<HeroModalPerformanceProps> = ({ 
  matchups, 
  synergies,
  gamesLogged,
  heroes
}) => {
  if (gamesLogged === 0) return null;
  
  // Get hero name by ID
  const getHeroName = (id: number) => {
    return heroes.find(h => h.id === id)?.name || "Unknown Hero";
  };
  
  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Tabs defaultValue="matchups" className="w-full mt-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="matchups">Matchups</TabsTrigger>
          <TabsTrigger value="synergies">Synergies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matchups" className="mt-4">
          <h4 className="text-sm font-medium mb-2">Hero Matchups</h4>
          {matchups.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Against</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchups.slice(0, 5).map((matchup) => (
                    <TableRow key={`${matchup.heroId}-${matchup.opponentId}`}>
                      <TableCell>{getHeroName(matchup.opponentId)}</TableCell>
                      <TableCell className="text-right">
                        <HeroWinRate 
                          winRate={matchup.winRate} 
                          gamesPlayed={matchup.gamesPlayed}
                          showDetails={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No matchup data available yet.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="synergies" className="mt-4">
          <h4 className="text-sm font-medium mb-2">Hero Synergies</h4>
          {synergies.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>With</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {synergies.slice(0, 5).map((synergy) => (
                    <TableRow key={`${synergy.heroId}-${synergy.allyId}`}>
                      <TableCell>{getHeroName(synergy.allyId)}</TableCell>
                      <TableCell className="text-right">
                        <HeroWinRate 
                          winRate={synergy.winRate} 
                          gamesPlayed={synergy.gamesPlayed}
                          showDetails={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No synergy data available yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
