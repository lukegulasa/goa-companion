
import React from 'react';

interface TeamRosterProps {
  teamName: string;
  teamColor: string;
  players: any[];
}

const TeamRoster: React.FC<TeamRosterProps> = ({ 
  teamName, 
  teamColor, 
  players 
}) => {
  return (
    <div>
      <h3 className={`font-medium mb-3 ${teamColor}`}>{teamName}</h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-2">
            <span>{player.name}</span>
            <span className="font-medium">{player.heroName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRoster;
