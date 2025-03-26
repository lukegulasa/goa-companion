
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
  
  const stats = getHeroStats(hero.id, heroStats);
  
  // Create hero image path with special cases
  const getHeroImagePath = (heroName: string) => {
    // Handle special cases
    if (heroName === "Widget and Pyro") return "/heroes/widget.jpg";
    if (heroName === "Ignatia") return "/heroes/ignatia.jpg"; // Fixed typo in filename
    
    // Default case
    return `/heroes/${heroName.toLowerCase()}.jpg`;
  };
  
  const heroImagePath = getHeroImagePath(hero.name);
  
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
          {/* Hero Image and Name row */}
          <div className="flex items-start">
            {/* Hero Image Container */}
            <div className="w-16 h-16 bg-amber-800/20 border border-amber-700/30 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={heroImagePath} 
                alt={hero.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, show placeholder text
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML += '<span class="text-xs text-amber-600/60 font-rune">Hero Image</span>';
                }}
              />
            </div>
            
            {/* Hero name and stars - aligned with image */}
            <div className="ml-2 flex flex-col">
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
          </div>
          
          {/* Stats and Win Rate row - below the image/name */}
          <div className="flex justify-between items-center mt-2 w-full">
            <div className="flex text-xs text-muted-foreground flex-wrap">
              <span className="mr-1 font-rune">A:{hero.stats.attack.base}</span>
              <span className="mr-1 font-rune">I:{hero.stats.initiative.base}</span>
              <span className="mr-1 font-rune">D:{hero.stats.defense.base}</span>
              <span className="font-rune">M:{hero.stats.movement.base}</span>
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
