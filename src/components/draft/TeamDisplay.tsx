
import React from 'react';
import HeroCard from '@/components/HeroCard';
import { Hero } from '@/lib/types';

interface Player {
  id: number;
  name: string;
  hero: Hero;
  team?: 'A' | 'B';
}

interface TeamDisplayProps {
  team: 'A' | 'B';
  players: Player[];
  captainId: number | null;
  teamColor: string;
  teamName: string;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
  team,
  players,
  captainId,
  teamColor,
  teamName
}) => {
  const teamPlayers = players.filter(player => player.team === team);

  return (
    <div>
      <h3 className="text-md font-medium mb-3 flex items-center">
        <span className={`inline-block w-3 h-3 ${teamColor} rounded-full mr-2`}></span>
        {teamName}
      </h3>
      
      <div className="space-y-3">
        {teamPlayers.map(player => (
          <div key={player.id} className="flex items-center p-3 bg-muted/30 rounded-md">
            <div className="flex-1">
              <div className="font-medium">{player.name}</div>
              <div className="text-sm text-muted-foreground">
                {player.id === captainId ? 'Captain • ' : ''}{player.hero.name}
              </div>
            </div>
            <HeroCard hero={player.hero} onClick={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;
