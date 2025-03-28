
import React, { useState } from 'react';
import FilterBar from '@/components/FilterBar';
import HeroGrid from '@/components/HeroGrid';
import TagInfoPanel from '@/components/TagInfoPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoIcon, BarChart } from 'lucide-react';
import { useHeroStats } from '@/hooks/use-hero-stats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const Index: React.FC = () => {
  const [tagInfoOpen, setTagInfoOpen] = useState(false);
  const { heroStats, gamesLogged } = useHeroStats();
  const isMobile = useIsMobile();
  
  // Sort heroes by win rate for the top performers
  const topHeroes = [...heroStats]
    .filter(hero => hero.gamesPlayed >= 3)  // Only include heroes with at least 3 games
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);

  return (
    <div className="container max-w-6xl mx-auto pt-4 px-4 sm:px-6 relative z-0">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 text-[#656C74] border-[#A47F48]/30 hover:bg-[#A47F48]/10"
          onClick={() => setTagInfoOpen(true)}
        >
          <InfoIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Tag Reference</span>
        </Button>
      </div>

      {gamesLogged > 0 && (
        <div className="mb-6">
          <Card className="border-[#A47F48]/30 bg-[#EEEDE8]/80">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <BarChart className="w-5 h-5 mr-2 text-[#A47F48]" />
                <h3 className="text-lg font-medium text-[#262125]">Hero Statistics</h3>
              </div>
              
              <Tabs defaultValue="top" className="w-full">
                <TabsList className={`grid grid-cols-2 w-full mb-4 bg-[#262125]/5 text-[#656C74] ${isMobile ? 'text-xs' : ''}`}>
                  <TabsTrigger value="top" className="data-[state=active]:bg-[#A47F48]/30 data-[state=active]:text-[#262125]">Top Performers</TabsTrigger>
                  <TabsTrigger value="most" className="data-[state=active]:bg-[#A47F48]/30 data-[state=active]:text-[#262125]">Most Played</TabsTrigger>
                </TabsList>
                
                <TabsContent value="top">
                  {topHeroes.length > 0 ? (
                    <div className="space-y-2">
                      {topHeroes.map(hero => (
                        <div key={hero.heroId} className={`flex ${isMobile ? 'flex-col' : 'justify-between items-center'} p-2 bg-[#262125]/5 rounded`}>
                          <span className="font-medium text-[#262125]">{hero.heroName}</span>
                          <div className={`flex ${isMobile ? 'mt-1 justify-between' : 'items-center space-x-2'}`}>
                            <span className="text-[#A47F48] font-medium">{hero.winRate}% Win Rate</span>
                            <span className="text-[#656C74] text-sm">({hero.gamesPlayed} games)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#656C74] text-sm">
                      Not enough games played yet to show top performing heroes.
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="most">
                  {heroStats.length > 0 ? (
                    <div className="space-y-2">
                      {[...heroStats]
                        .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
                        .slice(0, 5)
                        .map(hero => (
                          <div key={hero.heroId} className={`flex ${isMobile ? 'flex-col' : 'justify-between items-center'} p-2 bg-[#262125]/5 rounded`}>
                            <span className="font-medium text-[#262125]">{hero.heroName}</span>
                            <div className={`flex ${isMobile ? 'mt-1 justify-between' : 'items-center space-x-2'}`}>
                              <span className="text-sm">{hero.gamesPlayed} games</span>
                              <span className="text-sm text-[#656C74]">({hero.winRate}% win rate)</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-[#656C74] text-sm">
                      No games logged yet.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      <FilterBar />
      <HeroGrid />
      <TagInfoPanel 
        open={tagInfoOpen} 
        onOpenChange={setTagInfoOpen} 
      />
    </div>
  );
};

export default Index;
