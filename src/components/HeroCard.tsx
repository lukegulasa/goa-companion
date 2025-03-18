
import React from 'react';
import { Hero } from '@/lib/types';
import TagBadge from './TagBadge';
import { Star } from 'lucide-react';

interface HeroCardProps {
  hero: Hero;
  onClick: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onClick }) => {
  // Format stat total to show boosted value if available
  const statTotal = hero.statTotal.boosted 
    ? `${hero.statTotal.base} (${hero.statTotal.boosted})` 
    : hero.statTotal.base.toString();

  return (
    <div 
      className="hero-card cursor-pointer w-full h-full flex flex-col animate-fade-in"
      onClick={onClick}
    >
      <div className="relative p-4 flex-1 flex flex-col">
        {/* Name and stars */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {hero.name}
          </h3>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: hero.stars }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                strokeWidth={1}
              />
            ))}
          </div>
        </div>
        
        {/* Primary tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {hero.primaryTags.map((tag) => (
            <TagBadge key={tag} tag={tag} size="small" />
          ))}
        </div>
        
        {/* Stats */}
        <div className="mt-auto p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Stat Total
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {statTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
