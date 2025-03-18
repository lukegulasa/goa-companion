
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { newPlayerSchema, NewPlayerFormValues } from '@/lib/game-stats-types';

interface PlayerFormProps {
  onAddPlayer: (data: NewPlayerFormValues) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
  const newPlayerForm = useForm<NewPlayerFormValues>({
    resolver: zodResolver(newPlayerSchema),
    defaultValues: {
      playerName: '',
    },
  });

  const handleSubmit = (data: NewPlayerFormValues) => {
    onAddPlayer(data);
    newPlayerForm.reset();
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
      <form onSubmit={newPlayerForm.handleSubmit(handleSubmit)} className="flex gap-4">
        <Input
          placeholder="Player Name"
          {...newPlayerForm.register('playerName')}
          className="max-w-xs"
        />
        <Button type="submit">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      </form>
      {newPlayerForm.formState.errors.playerName && (
        <p className="text-destructive text-sm mt-2">
          {newPlayerForm.formState.errors.playerName.message}
        </p>
      )}
    </div>
  );
};
