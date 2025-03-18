
import React from 'react';
import { Hero } from '@/lib/types';
import TagBadge from './TagBadge';
import { Star, Shield, Zap, Gauge, MoveHorizontal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HeroCardProps {
  hero: Hero;
  onClick: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onClick }) => {
  // Format stat total to show boosted value if available
  const statTotal = hero.statTotal.boosted 
    ? `${hero.statTotal.base} (${hero.statTotal.boosted})` 
    : hero.statTotal.base.toString();

  // Helper function to format a stat with its boosted value if available
  const formatStat = (stat: { base: number; boosted?: number }) => {
    return stat.boosted ? `${stat.base} (${stat.boosted})` : stat.base.toString();
  };

  // Calculate progress percentage (0-100%) based on a stat value (1-8)
  const calculateProgress = (value: number) => {
    return (value / 8) * 100;
  };

  return (
    <div 
      className="hero-card cursor-pointer w-full h-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-900 overflow-hidden animate-fade-in"
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
        
        {/* All tags instead of just primary tags */}
        <div className="mb-4 flex flex-wrap gap-1.5 tag-container">
          {hero.allTags.map((tag) => (
            <TagBadge key={tag} tag={tag} size="small" />
          ))}
        </div>
        
        {/* Stats */}
        <div className="mt-auto p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          {/* Individual stats with icons and progress bars */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  ATK: {formatStat(hero.stats.attack)}
                </span>
              </div>
              <Progress 
                value={calculateProgress(hero.stats.attack.base)} 
                boostedValue={hero.stats.attack.boosted ? calculateProgress(hero.stats.attack.boosted) : undefined}
                className="h-1.5 bg-red-100 dark:bg-red-950/30" 
                baseColor="bg-red-400"
                boostedColor="bg-red-600"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  INI: {formatStat(hero.stats.initiative)}
                </span>
              </div>
              <Progress 
                value={calculateProgress(hero.stats.initiative.base)} 
                boostedValue={hero.stats.initiative.boosted ? calculateProgress(hero.stats.initiative.boosted) : undefined}
                className="h-1.5 bg-yellow-100 dark:bg-yellow-950/30" 
                baseColor="bg-yellow-400"
                boostedColor="bg-yellow-600"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  DEF: {formatStat(hero.stats.defense)}
                </span>
              </div>
              <Progress 
                value={calculateProgress(hero.stats.defense.base)} 
                boostedValue={hero.stats.defense.boosted ? calculateProgress(hero.stats.defense.boosted) : undefined}
                className="h-1.5 bg-blue-100 dark:bg-blue-950/30" 
                baseColor="bg-blue-400"
                boostedColor="bg-blue-600"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <MoveHorizontal className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  MOV: {formatStat(hero.stats.movement)}
                </span>
              </div>
              <Progress 
                value={calculateProgress(hero.stats.movement.base)} 
                boostedValue={hero.stats.movement.boosted ? calculateProgress(hero.stats.movement.boosted) : undefined}
                className="h-1.5 bg-green-100 dark:bg-green-950/30" 
                baseColor="bg-green-400"
                boostedColor="bg-green-600"
              />
            </div>
          </div>
          
          {/* Stat total */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
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
