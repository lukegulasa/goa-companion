
import React, { useState } from 'react';
import { format } from 'date-fns';
import { TrophyIcon, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Game } from '@/lib/game-stats-types';
import { GameTeamRoster } from './GameTeamRoster';
import { GameMobileView } from './GameMobileView';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameCardProps {
  game: Game;
  isAdmin: boolean;
  onEditGame?: (game: Game) => void;
  onDeleteGame?: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isAdmin,
  onEditGame,
  onDeleteGame,
}) => {
  const isMobile = useIsMobile();

  // Helper function to group players by team
  const getTeamPlayers = (team: 'Red' | 'Blue') => {
    return game.players.filter(player => player.team === team);
  };

  return (
    <div className={`rounded-md border ${isMobile ? 'p-2' : 'p-3 sm:p-4'} w-full`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4">
        <div>
          <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
            Game on {format(new Date(game.date), 'MMMM d, yyyy')}
          </h3>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            {game.winningTeam} won by {game.victoryMethod || 'Victory'}
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-1 sm:mt-0">
          <div className="flex items-center">
            <TrophyIcon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-1 text-yellow-500`} />
            <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>{game.winningTeam}</span>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
              {onEditGame && (
                <Button 
                  variant="ghost" 
                  size={isMobile ? "sm" : "icon"} 
                  className="text-primary/70 hover:text-primary hover:bg-primary/10 h-7 w-7 p-0"
                  onClick={() => onEditGame(game)}
                >
                  <Pencil className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                  <span className="sr-only">Edit game</span>
                </Button>
              )}
              
              {onDeleteGame && (
                <Button 
                  variant="ghost" 
                  size={isMobile ? "sm" : "icon"}
                  className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                  onClick={() => onDeleteGame(game.id)}
                >
                  <Trash2 className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                  <span className="sr-only">Delete game</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isMobile ? (
        // Mobile view - full width with no excess margins
        <div className="w-full mt-1">
          <GameMobileView players={game.players} />
        </div>
      ) : (
        // Desktop view - team-based layout
        <div className="grid grid-cols-2 gap-4">
          <GameTeamRoster 
            teamPlayers={getTeamPlayers('Blue')} 
            teamName="Blue" 
            winningTeam={game.winningTeam} 
          />
          <GameTeamRoster 
            teamPlayers={getTeamPlayers('Red')} 
            teamName="Red" 
            winningTeam={game.winningTeam} 
          />
        </div>
      )}
    </div>
  );
};
