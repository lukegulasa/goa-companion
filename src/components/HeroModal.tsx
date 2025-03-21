
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGallery } from '@/context/GalleryContext';
import { Star, Shield, Zap, ArrowRight, Activity } from 'lucide-react';
import TagBadge from './TagBadge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useHeroStats } from '@/hooks/use-hero-stats';
import { getHeroMatchups, getHeroStats, getHeroSynergies } from '@/lib/hero-stats-utils';
import { HeroWinRate } from './HeroWinRate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const HeroModal: React.FC = () => {
  const { selectedHero, isModalOpen, closeModal, heroes } = useGallery();
  const { heroStats, heroMatchups, heroSynergies, gamesLogged } = useHeroStats();

  if (!selectedHero) return null;

  // Get stats for the selected hero
  const heroStat = getHeroStats(selectedHero.id, heroStats);
  const matchups = getHeroMatchups(selectedHero.id, heroMatchups)
    .filter(m => m.gamesPlayed >= 1)
    .sort((a, b) => b.winRate - a.winRate);
  const synergies = getHeroSynergies(selectedHero.id, heroSynergies)
    .filter(s => s.gamesPlayed >= 1)
    .sort((a, b) => b.winRate - a.winRate);

  // Format stat display with boosted values
  const formatStat = (base: number, boosted?: number) => {
    if (boosted) {
      return `${base} (${boosted})`;
    }
    return base.toString();
  };

  // Calculate the total stats
  const statTotal = selectedHero.statTotal.boosted 
    ? `${selectedHero.statTotal.base} (${selectedHero.statTotal.boosted})` 
    : selectedHero.statTotal.base.toString();

  // Calculate progress percentage (0-100%) based on a stat value (1-8)
  const calculateProgress = (value: number) => {
    return (value / 8) * 100;
  };

  // Get hero name by ID
  const getHeroName = (id: number) => {
    return heroes.find(h => h.id === id)?.name || "Unknown Hero";
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden glass-panel max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>{selectedHero.fullName}</span>
            <div className="flex items-center">
              {Array.from({ length: selectedHero.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  strokeWidth={1}
                />
              ))}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-2">
          {/* Win Rate Section */}
          {gamesLogged > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-medium">Win Rate</h3>
              <div className="flex items-center gap-2">
                <HeroWinRate 
                  winRate={heroStat?.winRate || 0} 
                  gamesPlayed={heroStat?.gamesPlayed || 0}
                  showDetails={true}
                />
              </div>
            </div>
          )}
          
          {/* Tags section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedHero.allTags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
          
          {/* Stats section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Attack */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Activity className="w-4 h-4 mr-1.5 text-red-500" />
                  <span className="text-sm font-medium">Attack</span>
                </div>
                <span className="text-xl font-bold">
                  {formatStat(selectedHero.stats.attack.base, selectedHero.stats.attack.boosted)}
                </span>
                <Progress 
                  value={calculateProgress(selectedHero.stats.attack.base)} 
                  boostedValue={selectedHero.stats.attack.boosted ? calculateProgress(selectedHero.stats.attack.boosted) : undefined}
                  className="h-2 mt-1.5 bg-red-100 dark:bg-red-950/30" 
                  baseColor="bg-red-400"
                  boostedColor="bg-red-600"
                />
              </div>
              
              {/* Initiative */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Zap className="w-4 h-4 mr-1.5 text-yellow-500" />
                  <span className="text-sm font-medium">Initiative</span>
                </div>
                <span className="text-xl font-bold">
                  {formatStat(selectedHero.stats.initiative.base, selectedHero.stats.initiative.boosted)}
                </span>
                <Progress 
                  value={calculateProgress(selectedHero.stats.initiative.base)} 
                  boostedValue={selectedHero.stats.initiative.boosted ? calculateProgress(selectedHero.stats.initiative.boosted) : undefined}
                  className="h-2 mt-1.5 bg-yellow-100 dark:bg-yellow-950/30" 
                  baseColor="bg-yellow-400"
                  boostedColor="bg-yellow-600"
                />
              </div>
              
              {/* Defense */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Shield className="w-4 h-4 mr-1.5 text-blue-500" />
                  <span className="text-sm font-medium">Defense</span>
                </div>
                <span className="text-xl font-bold">
                  {formatStat(selectedHero.stats.defense.base, selectedHero.stats.defense.boosted)}
                </span>
                <Progress 
                  value={calculateProgress(selectedHero.stats.defense.base)} 
                  boostedValue={selectedHero.stats.defense.boosted ? calculateProgress(selectedHero.stats.defense.boosted) : undefined}
                  className="h-2 mt-1.5 bg-blue-100 dark:bg-blue-950/30" 
                  baseColor="bg-blue-400"
                  boostedColor="bg-blue-600"
                />
              </div>
              
              {/* Movement */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <ArrowRight className="w-4 h-4 mr-1.5 text-green-500" />
                  <span className="text-sm font-medium">Movement</span>
                </div>
                <span className="text-xl font-bold">
                  {formatStat(selectedHero.stats.movement.base, selectedHero.stats.movement.boosted)}
                </span>
                <Progress 
                  value={calculateProgress(selectedHero.stats.movement.base)} 
                  boostedValue={selectedHero.stats.movement.boosted ? calculateProgress(selectedHero.stats.movement.boosted) : undefined}
                  className="h-2 mt-1.5 bg-green-100 dark:bg-green-950/30" 
                  baseColor="bg-green-400"
                  boostedColor="bg-green-600"
                />
              </div>
            </div>
            
            {/* Total stats */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stat Total</span>
                <span className="text-xl font-bold">{statTotal}</span>
              </div>
            </div>
            
            {/* Performance Data Section */}
            {gamesLogged > 0 && (
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
            )}
            
            {/* Additional information - Abilities, Playstyle, Synergies */}
            {(selectedHero.abilities || selectedHero.playstyle || selectedHero.synergies) && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Additional Information
                </h3>
                
                {selectedHero.abilities && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Abilities</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedHero.abilities.map((ability, index) => (
                        <li key={index}>{ability}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedHero.playstyle && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Playstyle</h4>
                    <p className="text-sm">{selectedHero.playstyle}</p>
                  </div>
                )}
                
                {selectedHero.synergies && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Synergies</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedHero.synergies.map((synergy, index) => (
                        <li key={index}>{synergy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeroModal;
