
import React, { useState } from 'react';
import { format } from 'date-fns';
import { TrophyIcon, Trash2 } from 'lucide-react';
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

interface GameHistoryProps {
  games: Game[];
  onDeleteGame?: (gameId: string) => void;
}

export const GameHistory: React.FC<GameHistoryProps> = ({ games, onDeleteGame }) => {
  const { toast } = useToast();
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  
  const handleDeleteGame = (gameId: string) => {
    if (onDeleteGame) {
      onDeleteGame(gameId);
      toast({
        title: "Game Deleted",
        description: "The game has been removed from your history."
      });
    }
    setGameToDelete(null);
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Game History</h2>
      
      {games.length > 0 ? (
        <div className="space-y-6">
          {games.map((game) => (
            <div key={game.id} className="rounded-md border p-4">
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
                  
                  {onDeleteGame && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 ml-4"
                      onClick={() => setGameToDelete(game.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete game</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="rounded-md border">
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
                        <TableCell>{player.heroName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">No games logged yet.</p>
        </div>
      )}
      
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
    </div>
  );
};
