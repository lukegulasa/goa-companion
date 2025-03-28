
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
    <div className="rounded-md border p-3 sm:p-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">
            Game on {format(new Date(game.date), 'MMMM d, yyyy')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {game.winningTeam} won by {game.victoryMethod || 'Victory'}
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex items-center">
            <TrophyIcon className="h-5 w-5 mr-1 text-yellow-500" />
            <span className="font-medium">{game.winningTeam}</span>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-2 ml-4">
              {onEditGame && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary/70 hover:text-primary hover:bg-primary/10"
                  onClick={() => onEditGame(game)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit game</span>
                </Button>
              )}
              
              {onDeleteGame && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDeleteGame(game.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete game</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isMobile ? (
        // Mobile view - full width
        <div className="w-full max-w-full overflow-visible">
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
