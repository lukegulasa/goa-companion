
import React from 'react';
import { GamePlayer } from '@/lib/game-stats-types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface GameTeamRosterProps {
  teamPlayers: GamePlayer[];
  teamName: 'Red' | 'Blue';
  winningTeam: 'Red' | 'Blue';
}

export const GameTeamRoster: React.FC<GameTeamRosterProps> = ({ 
  teamPlayers, 
  teamName, 
  winningTeam 
}) => {
  // Create hero image path with special cases
  const getHeroImagePath = (heroName: string) => {
    // Handle special cases consistently
    if (heroName === "Widget and Pyro" || heroName === "Widget And Pyro") return "/heroes/widget.jpg";
    if (heroName === "Ignatia") return "/heroes/ignatia.jpg";
    
    // Default case
    return `/heroes/${heroName.toLowerCase()}.jpg`;
  };

  const isWinningTeam = teamName === winningTeam;
  
  return (
    <div className={`p-3 rounded-md border ${teamName === 'Red' ? 'bg-red-500/20' : 'bg-blue-500/20'} ${isWinningTeam ? 'ring-2 ring-amber-300/50' : ''}`}>
      <div className="flex items-center mb-2">
        <div className={`w-3 h-3 rounded-full mr-2 ${teamName === 'Red' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
        <h4 className="font-medium">{teamName} Team {isWinningTeam && '(Winner)'}</h4>
      </div>
      
      <div className="space-y-2">
        {teamPlayers.map((player) => (
          <div key={player.playerId} className="flex items-center">
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage 
                src={getHeroImagePath(player.heroName)} 
                alt={player.heroName} 
              />
              <AvatarFallback className="text-xs font-rune">{player.heroName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            <div>
              <span className="text-sm font-medium">{player.playerName}</span>
              <div className="text-xs text-muted-foreground">{player.heroName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
