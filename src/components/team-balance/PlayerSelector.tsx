
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlayerWithStats } from '@/lib/team-balance-utils';

interface PlayerSelectorProps {
  playerStats: PlayerWithStats[];
  selectedPlayerIds: string[];
  teamSize: '2v2' | '3v3';
  onPlayerSelect: (playerId: string) => void;
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  playerStats,
  selectedPlayerIds,
  teamSize,
  onPlayerSelect,
}) => {
  return (
    <div>
      <Label className="text-base mb-2 block">Select Players</Label>
      <p className="text-sm text-muted-foreground mb-4">
        Select {teamSize === '2v2' ? '4' : '6'} players to create balanced teams
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {playerStats.map(player => (
          <div 
            key={player.id}
            className={`p-3 border rounded-md flex items-center ${
              selectedPlayerIds.includes(player.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border'
            }`}
          >
            <Checkbox 
              id={`player-${player.id}`}
              checked={selectedPlayerIds.includes(player.id)}
              onCheckedChange={() => onPlayerSelect(player.id)}
            />
            <Label 
              htmlFor={`player-${player.id}`}
              className="flex-1 ml-3 cursor-pointer"
            >
              {player.name}
            </Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(player.weightedStrength * 100) / 100}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;
