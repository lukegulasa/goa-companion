
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { newPlayerSchema, NewPlayerFormValues } from '@/lib/game-stats-types';
import { UserPlus } from 'lucide-react';

interface PlayerFormProps {
  onAddPlayer: (data: NewPlayerFormValues) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
  const form = useForm<NewPlayerFormValues>({
    resolver: zodResolver(newPlayerSchema),
    defaultValues: {
      playerName: '',
    },
  });

  const onSubmit = (data: NewPlayerFormValues) => {
    onAddPlayer(data);
    form.reset();
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add a New Player</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="playerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter player name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </form>
      </Form>
    </div>
  );
};
