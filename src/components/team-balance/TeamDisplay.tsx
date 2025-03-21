
import React from 'react';
import { PlayerWithStats } from '@/lib/team-balance-utils';
import { Badge } from '@/components/ui/badge';

interface TeamDisplayProps {
  team: 'A' | 'B';
  players: PlayerWithStats[];
  teamStrength: number;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, players, teamStrength }) => {
  const teamColor = team === 'A' ? 'bg-blue-600' : 'bg-red-600';
  const teamName = team === 'A' ? 'Team A' : 'Team B';
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <div className={`w-3 h-3 rounded-full ${teamColor} mr-2`}></div>
          {teamName}
        </h3>
        <Badge variant="secondary">
          Strength: {Math.round(teamStrength * 100) / 100}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {players && players.map(player => (
          <div key={player.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <div className="font-medium">{player.name}</div>
              <div className="text-sm text-muted-foreground">
                {player.gamesPlayed} games • {Math.round(player.winRate * 100)}% wins
              </div>
            </div>
            <Badge variant="outline">
              {Math.round(player.weightedStrength * 100) / 100}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;
