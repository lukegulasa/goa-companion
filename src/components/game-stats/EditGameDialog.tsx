
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Game, GameLogFormValues, gameLogSchema } from '@/lib/game-stats-types';

interface EditGameDialogProps {
  game: Game;
  onSave: (gameId: string, updatedGame: Partial<Game>) => void;
  onCancel: () => void;
}

export const EditGameDialog: React.FC<EditGameDialogProps> = ({
  game,
  onSave,
  onCancel,
}) => {
  const form = useForm<GameLogFormValues>({
    resolver: zodResolver(gameLogSchema),
    defaultValues: {
      date: new Date(game.date),
      winningTeam: game.winningTeam,
      victoryMethod: game.victoryMethod,
    },
  });

  const handleSubmit = (data: GameLogFormValues) => {
    onSave(game.id, {
      date: data.date.toISOString(),
      winningTeam: data.winningTeam,
      victoryMethod: data.victoryMethod,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Game Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Winning Team */}
            <FormField
              control={form.control}
              name="winningTeam"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Winning Team</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Red" id="red-edit" />
                        <label htmlFor="red-edit">Red</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Blue" id="blue-edit" />
                        <label htmlFor="blue-edit">Blue</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Victory Method */}
            {(game.victoryMethod || form.getValues().victoryMethod) && (
              <FormField
                control={form.control}
                name="victoryMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Victory Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Wave Counter" id="wave-edit" />
                          <label htmlFor="wave-edit">Wave Counter</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Base Push" id="base-edit" />
                          <label htmlFor="base-edit">Base Push</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Hero Kills" id="kills-edit" />
                          <label htmlFor="kills-edit">Hero Kills</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
