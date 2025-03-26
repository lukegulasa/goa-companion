
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useGallery } from '@/context/GalleryContext';
import { Hero } from '@/lib/types';
import { HeroWinRate } from '@/components/HeroWinRate';
import { useHeroStats } from '@/hooks/use-hero-stats';
import { getHeroStats } from '@/lib/hero-stats-utils';

interface HeroCardProps {
  hero: Hero;
  onClick?: () => void; // Added onClick as an optional prop
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onClick }) => {
  const { selectHero } = useGallery();
  const { heroStats } = useHeroStats();
  
  // Get win rate stats for this hero
  const stats = getHeroStats(hero.id, heroStats);
  
  // Use the provided onClick if available, otherwise use selectHero
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      selectHero(hero);
    }
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md glass-panel"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col">
          {/* Hero Image Container */}
          <div className="w-full flex justify-center mb-2">
            <div className="w-20 h-20 bg-amber-800/20 border border-amber-700/30 rounded-md overflow-hidden flex items-center justify-center">
              {/* Hero image will go here */}
              <span className="text-xs text-amber-600/60 font-rune">Hero Image</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold truncate">{hero.name}</h3>
            <div className="flex items-center">
              {Array.from({ length: hero.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCard;
