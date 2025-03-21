
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
        ${isSelected ? 'ring-2 ring-primary' : ''} 
        ${isBanned ? 'opacity-40 grayscale' : 'hover:scale-[1.02] hover:shadow-md'} 
        glass-panel
      `}
      onClick={isBanned ? undefined : onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold truncate text-sm">{hero.name}</h3>
          <div className="flex items-center">
            {Array.from({ length: hero.stars }).map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 fill-yellow-400 text-yellow-400"
                strokeWidth={1}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="flex text-xs text-muted-foreground">
              <span className="mr-1">A:{hero.stats.attack.base}</span>
              <span className="mr-1">I:{hero.stats.initiative.base}</span>
              <span className="mr-1">D:{hero.stats.defense.base}</span>
              <span>M:{hero.stats.movement.base}</span>
            </div>
          </div>
          
          {/* Show win rate */}
          <HeroWinRate 
            winRate={stats?.winRate || 0} 
            gamesPlayed={stats?.gamesPlayed || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};
