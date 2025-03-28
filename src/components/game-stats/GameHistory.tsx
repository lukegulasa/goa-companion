
import React, { useState } from 'react';
import { format } from 'date-fns';
import { TrophyIcon, Trash2, Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Game } from '@/lib/game-stats-types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditGameDialog } from './EditGameDialog';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeroModalImage } from '@/components/hero-modal/HeroModalImage';

interface GameHistoryProps {
  games: Game[];
  onDeleteGame?: (gameId: string) => void;
  onEditGame?: (gameId: string, updatedGame: Partial<Game>) => void;
  isAdmin?: boolean;
}

export const GameHistory: React.FC<GameHistoryProps> = ({ 
  games, 
  onDeleteGame,
  onEditGame,
  isAdmin: propIsAdmin = false
}) => {
  const { toast } = useToast();
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  const { isAdmin: contextIsAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  // Use either the prop or context admin status, prioritizing context
  const isAdmin = contextIsAdmin || propIsAdmin;
  
  const handleDeleteGame = (gameId: string) => {
    if (!isAdmin) return;
    
    if (onDeleteGame) {
      onDeleteGame(gameId);
      toast({
        title: "Game Deleted",
        description: "The game has been removed from your history."
      });
    }
    setGameToDelete(null);
  };

  const handleEditGame = (gameId: string, updatedGame: Partial<Game>) => {
    if (!isAdmin) return;
    
    if (onEditGame) {
      onEditGame(gameId, updatedGame);
      toast({
        title: "Game Updated",
        description: "The game has been successfully updated."
      });
    }
    setGameToEdit(null);
  };

  // Helper function to group players by team
  const getTeamPlayers = (game: Game, team: 'Red' | 'Blue') => {
    return game.players.filter(player => player.team === team);
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Game History</h2>
      
      {games.length > 0 ? (
        <div className="space-y-6">
          {games.map((game) => (
            <div key={game.id} className="rounded-md border p-3 sm:p-4 w-full">
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
                          onClick={() => setGameToEdit(game)}
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
                          onClick={() => setGameToDelete(game.id)}
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
                // Mobile view - single column layout with full width
                <div className="rounded-md border w-full overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Hero</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {game.players.map((player) => (
                        <TableRow key={player.playerId}>
                          <TableCell>{player.playerName}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              player.team === "Blue" 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            )}>
                              {player.team}
                            </span>
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/heroes/${player.heroName.toLowerCase()}.jpg`} alt={player.heroName} />
                              <AvatarFallback className="text-xs bg-amber-100 text-amber-800">{player.heroName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {player.heroName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                // Desktop view - team-based layout
                <div className="grid grid-cols-2 gap-4">
                  {/* Blue Team */}
                  <div className="rounded-md border bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="py-2 px-4 bg-blue-100 dark:bg-blue-900/30 border-b">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">Blue Team</h4>
                    </div>
                    <div className="p-3">
                      {getTeamPlayers(game, 'Blue').length > 0 ? (
                        <ul className="divide-y">
                          {getTeamPlayers(game, 'Blue').map((player) => (
                            <li key={player.playerId} className="py-2 flex items-center">
                              <div className="mr-3">
                                <Avatar className="h-8 w-8 border border-blue-200 dark:border-blue-800">
                                  <AvatarImage src={`/heroes/${player.heroName.toLowerCase()}.jpg`} alt={player.heroName} />
                                  <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{player.heroName.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <div className="font-medium">{player.playerName}</div>
                                <div className="text-sm text-muted-foreground">{player.heroName}</div>
                              </div>
                              {game.winningTeam === 'Blue' && (
                                <TrophyIcon className="h-4 w-4 ml-auto text-yellow-500" />
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground p-2">No players on Blue Team</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Red Team */}
                  <div className="rounded-md border bg-red-50/50 dark:bg-red-950/20">
                    <div className="py-2 px-4 bg-red-100 dark:bg-red-900/30 border-b">
                      <h4 className="font-medium text-red-800 dark:text-red-300">Red Team</h4>
                    </div>
                    <div className="p-3">
                      {getTeamPlayers(game, 'Red').length > 0 ? (
                        <ul className="divide-y">
                          {getTeamPlayers(game, 'Red').map((player) => (
                            <li key={player.playerId} className="py-2 flex items-center">
                              <div className="mr-3">
                                <Avatar className="h-8 w-8 border border-red-200 dark:border-red-800">
                                  <AvatarImage src={`/heroes/${player.heroName.toLowerCase()}.jpg`} alt={player.heroName} />
                                  <AvatarFallback className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{player.heroName.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <div className="font-medium">{player.playerName}</div>
                                <div className="text-sm text-muted-foreground">{player.heroName}</div>
                              </div>
                              {game.winningTeam === 'Red' && (
                                <TrophyIcon className="h-4 w-4 ml-auto text-yellow-500" />
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground p-2">No players on Red Team</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed w-full">
          <p className="text-muted-foreground">No games logged yet.</p>
        </div>
      )}
      
      {isAdmin && (
        <>
          <AlertDialog open={!!gameToDelete} onOpenChange={(open) => !open && setGameToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Game</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this game? This action cannot be undone and will
                  remove this game from your statistics.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => gameToDelete && handleDeleteGame(gameToDelete)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {gameToEdit && (
            <EditGameDialog 
              game={gameToEdit}
              onSave={handleEditGame}
              onCancel={() => setGameToEdit(null)}
            />
          )}
        </>
      )}
    </div>
  );
};
