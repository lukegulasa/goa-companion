
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Hero } from '@/lib/types';
import { HeroWinRate } from '@/components/HeroWinRate';
import { useHeroStats } from '@/hooks/use-hero-stats';
import { getHeroStats } from '@/lib/hero-stats-utils';

interface DraftHeroCardProps {
  hero: Hero;
  onClick?: () => void;
  isSelected?: boolean;
  isBanned?: boolean;
}

export const DraftHeroCard: React.FC<DraftHeroCardProps> = ({ 
  hero, 
  onClick, 
  isSelected = false,
  isBanned = false
}) => {
  const { heroStats } = useHeroStats();
  
  // Get win rate stats for this hero
  const stats = getHeroStats(hero.id, heroStats);
  
  return (
    <Card 
      className={`
        overflow-hidden cursor-pointer transition-all 
        ${isSelected ? 'ring-2 ring-primary shadow-glow' : ''} 
        ${isBanned ? 'opacity-40 grayscale' : 'hover:scale-[1.02] hover:shadow-md'} 
        arcane-card
      `}
      onClick={isBanned ? undefined : onClick}
    >
      <CardContent className="p-3 relative">
        <div className="flex flex-col">
          {/* Hero Image Container */}
          <div className="w-full flex justify-center mb-2">
            <div className="w-16 h-16 bg-amber-800/20 border border-amber-700/30 rounded-md overflow-hidden flex items-center justify-center">
              {/* Hero image will go here */}
              <span className="text-xs text-amber-600/60 font-rune">Hero Image</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-serif font-semibold truncate text-sm">{hero.name}</h3>
            <div className="flex items-center">
              {Array.from({ length: hero.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-amber-400 text-amber-400"
                  strokeWidth={1}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="flex text-xs text-muted-foreground">
                <span className="mr-1 font-rune">A:{hero.stats.attack.base}</span>
                <span className="mr-1 font-rune">I:{hero.stats.initiative.base}</span>
                <span className="mr-1 font-rune">D:{hero.stats.defense.base}</span>
                <span className="font-rune">M:{hero.stats.movement.base}</span>
              </div>
            </div>
            
            {/* Show win rate */}
            <HeroWinRate 
              winRate={stats?.winRate || 0} 
              gamesPlayed={stats?.gamesPlayed || 0}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
