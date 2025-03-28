
import React from 'react';
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
import { Game } from '@/lib/game-stats-types';
import { EditGameDialog } from './EditGameDialog';

interface DeleteGameDialogProps {
  gameId: string | null;
  onClose: () => void;
  onDelete: (gameId: string) => void;
}

export const DeleteGameDialog: React.FC<DeleteGameDialogProps> = ({
  gameId,
  onClose,
  onDelete,
}) => {
  if (!gameId) return null;
  
  return (
    <AlertDialog open={!!gameId} onOpenChange={(open) => !open && onClose()}>
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
            onClick={() => onDelete(gameId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface EditGameDialogWrapperProps {
  game: Game | null;
  onClose: () => void;
  onSave: (gameId: string, updatedGame: Partial<Game>) => void;
}

export const EditGameDialogWrapper: React.FC<EditGameDialogWrapperProps> = ({
  game,
  onClose,
  onSave,
}) => {
  if (!game) return null;
  
  return (
    <EditGameDialog 
      game={game}
      onSave={onSave}
      onCancel={onClose}
    />
  );
};
