
import React from 'react';
import { GamePlayer } from '@/lib/game-stats-types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface GameMobileViewProps {
  players: GamePlayer[];
}

export const GameMobileView: React.FC<GameMobileViewProps> = ({ players }) => {
  // Create hero image path with special cases
  const getHeroImagePath = (heroName: string) => {
    // Handle special cases consistently
    if (heroName === "Widget and Pyro" || heroName === "Widget And Pyro") return "/heroes/widget.jpg";
    if (heroName === "Ignatia") return "/heroes/ignatia.jpg";
    
    // Default case
    return `/heroes/${heroName.toLowerCase()}.jpg`;
  };

  // Group players by team
  const blueTeamPlayers = players.filter(p => p.team === 'Blue');
  const redTeamPlayers = players.filter(p => p.team === 'Red');
  
  return (
    <div className="space-y-3 p-2">
      <div className="flex flex-row gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
        <div className="flex flex-wrap gap-1.5">
          {blueTeamPlayers.map((player) => (
            <div key={player.playerId} className="flex items-center border rounded-full pl-1 pr-2.5 py-1 bg-blue-50/30">
              <Avatar className="w-5 h-5 mr-1.5">
                <AvatarImage 
                  src={getHeroImagePath(player.heroName)} 
                  alt={player.heroName} 
                />
                <AvatarFallback className="text-[9px]">{player.heroName.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{player.playerName}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-row gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
        <div className="flex flex-wrap gap-1.5">
          {redTeamPlayers.map((player) => (
            <div key={player.playerId} className="flex items-center border rounded-full pl-1 pr-2.5 py-1 bg-red-50/30">
              <Avatar className="w-5 h-5 mr-1.5">
                <AvatarImage 
                  src={getHeroImagePath(player.heroName)} 
                  alt={player.heroName} 
                />
                <AvatarFallback className="text-[9px]">{player.heroName.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{player.playerName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
