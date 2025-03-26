
import React from 'react';
import { Stat } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Shield, ArrowRight } from 'lucide-react';

interface HeroModalStatsProps {
  stats: {
    attack: Stat;
    initiative: Stat;
    defense: Stat;
    movement: Stat;
  };
  statTotal: {
    base: number;
    boosted?: number;
  };
}

export const HeroModalStats: React.FC<HeroModalStatsProps> = ({ stats, statTotal }) => {
  // Format stat display with boosted values
  const formatStat = (base: number, boosted?: number) => {
    if (boosted) {
      return `${base} (${boosted})`;
    }
    return base.toString();
  };
  
  // Calculate progress percentage (0-100%) based on a stat value (1-8)
  const calculateProgress = (value: number) => {
    return (value / 8) * 100;
  };
  
  // Calculate the total stats
  const statTotalDisplay = statTotal.boosted 
    ? `${statTotal.base} (${statTotal.boosted})` 
    : statTotal.base.toString();
    
  return (
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
            {formatStat(stats.attack.base, stats.attack.boosted)}
          </span>
          <Progress 
            value={calculateProgress(stats.attack.base)} 
            boostedValue={stats.attack.boosted ? calculateProgress(stats.attack.boosted) : undefined}
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
            {formatStat(stats.initiative.base, stats.initiative.boosted)}
          </span>
          <Progress 
            value={calculateProgress(stats.initiative.base)} 
            boostedValue={stats.initiative.boosted ? calculateProgress(stats.initiative.boosted) : undefined}
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
            {formatStat(stats.defense.base, stats.defense.boosted)}
          </span>
          <Progress 
            value={calculateProgress(stats.defense.base)} 
            boostedValue={stats.defense.boosted ? calculateProgress(stats.defense.boosted) : undefined}
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
            {formatStat(stats.movement.base, stats.movement.boosted)}
          </span>
          <Progress 
            value={calculateProgress(stats.movement.base)} 
            boostedValue={stats.movement.boosted ? calculateProgress(stats.movement.boosted) : undefined}
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
          <span className="text-xl font-bold">{statTotalDisplay}</span>
        </div>
      </div>
    </div>
  );
};
