
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useGallery } from '@/context/GalleryContext';
import { Hero } from '@/lib/types';
import { HeroWinRate } from '@/components/HeroWinRate';
import { useHeroStats } from '@/hooks/use-hero-stats';
import { getHeroStats } from '@/lib/hero-stats-utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroCardProps {
  hero: Hero;
  onClick?: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onClick }) => {
  const { selectHero } = useGallery();
  const { heroStats } = useHeroStats();
  const isMobile = useIsMobile();
  
  const stats = getHeroStats(hero.id, heroStats);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      selectHero(hero);
    }
  };
  
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
      className="overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md glass-panel"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col">
          {/* Hero Image and Name row */}
          <div className="flex items-start">
            {/* Hero Image Container */}
            <div className="w-20 h-20 bg-amber-800/20 border border-amber-700/30 rounded-md overflow-hidden flex-shrink-0">
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
            
            {/* Hero name and details column */}
            <div className="ml-3 flex flex-col">
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
              
              {/* Win rate positioned below stars but still inline with image */}
              <div className="mt-1">
                <HeroWinRate 
                  winRate={stats?.winRate || 0} 
                  gamesPlayed={stats?.gamesPlayed || 0}
                />
              </div>
            </div>
          </div>
          
          {/* Stats in a more spread out layout */}
          <div className="grid grid-cols-4 gap-1 mt-3 text-xs text-muted-foreground">
            <div className="text-center">
              <span className="font-medium">ATK</span>
              <div>{hero.stats.attack.base}</div>
            </div>
            <div className="text-center">
              <span className="font-medium">INT</span>
              <div>{hero.stats.initiative.base}</div>
            </div>
            <div className="text-center">
              <span className="font-medium">DEF</span>
              <div>{hero.stats.defense.base}</div>
            </div>
            <div className="text-center">
              <span className="font-medium">MOV</span>
              <div>{hero.stats.movement.base}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCard;
