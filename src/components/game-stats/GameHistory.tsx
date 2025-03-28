
import React, { useState } from 'react';
import { Game } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';
import { GameCard } from './GameCard';
import { DeleteGameDialog, EditGameDialogWrapper } from './GameDialogs';
import { useAuth } from '@/context/AuthContext';
import { GameHistoryFilters } from './GameHistoryFilters';

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
  
  // Use either the prop or context admin status, prioritizing context
  const isAdmin = contextIsAdmin || propIsAdmin;
  
  // Filtering and sorting state
  const [playerFilter, setPlayerFilter] = useState<string>('');
  const [heroFilter, setHeroFilter] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
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

  // Filter and sort the games
  const filteredAndSortedGames = React.useMemo(() => {
    return games
      .filter(game => {
        // Filter by player
        if (playerFilter && !game.players.some(player => 
          player.playerName.toLowerCase().includes(playerFilter.toLowerCase())
        )) {
          return false;
        }
        
        // Filter by hero
        if (heroFilter && !game.players.some(player => 
          player.heroName.toLowerCase().includes(heroFilter.toLowerCase())
        )) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [games, playerFilter, heroFilter, sortDirection]);
  
  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Game History</h2>
      
      <GameHistoryFilters 
        playerFilter={playerFilter}
        setPlayerFilter={setPlayerFilter}
        heroFilter={heroFilter}
        setHeroFilter={setHeroFilter}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
      
      {filteredAndSortedGames.length > 0 ? (
        <div className="space-y-6 mt-4">
          {filteredAndSortedGames.map((game) => (
            <GameCard 
              key={game.id}
              game={game}
              isAdmin={isAdmin}
              onEditGame={(game) => setGameToEdit(game)}
              onDeleteGame={(gameId) => setGameToDelete(gameId)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed w-full mt-4">
          <p className="text-muted-foreground">
            {games.length > 0 ? "No games match your filters." : "No games logged yet."}
          </p>
        </div>
      )}
      
      {isAdmin && (
        <>
          <DeleteGameDialog 
            gameId={gameToDelete}
            onClose={() => setGameToDelete(null)}
            onDelete={handleDeleteGame}
          />
          
          <EditGameDialogWrapper
            game={gameToEdit}
            onClose={() => setGameToEdit(null)}
            onSave={handleEditGame}
          />
        </>
      )}
    </div>
  );
};
