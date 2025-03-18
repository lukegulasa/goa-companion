
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, TrophyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { GameLogFormValues, gameLogSchema, GamePlayer } from '@/lib/game-stats-types';
import { GameParticipants } from './GameParticipants';
import { Hero } from '@/lib/types';

interface GameLoggerProps {
  players: { id: string; name: string }[];
  heroes: Hero[];
  gameParticipants: GamePlayer[];
  setGameParticipants: React.Dispatch<React.SetStateAction<GamePlayer[]>>;
  onLogGame: (data: GameLogFormValues) => void;
}

export const GameLogger: React.FC<GameLoggerProps> = ({
  players,
  heroes,
  gameParticipants,
  setGameParticipants,
  onLogGame,
}) => {
  const gameLogForm = useForm<GameLogFormValues>({
    resolver: zodResolver(gameLogSchema),
    defaultValues: {
      date: new Date(),
      winningTeam: 'Atlantis',
      victoryMethod: 'Wave Counter',
    },
  });

  // Add a player to the current game
  const addPlayerToGame = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Check if player is already in the game
    if (gameParticipants.some(p => p.playerId === playerId)) return;
    
    setGameParticipants([
      ...gameParticipants,
      {
        playerId,
        playerName: player.name,
        team: 'Atlantis', // Default team
        heroId: 0, // Will be updated when selected
        heroName: '',
      },
    ]);
  };

  // Remove a player from the current game
  const removePlayerFromGame = (index: number) => {
    const updatedParticipants = [...gameParticipants];
    updatedParticipants.splice(index, 1);
    setGameParticipants(updatedParticipants);
  };

  // Update a participant's details
  const updateParticipant = (index: number, field: keyof GamePlayer, value: any) => {
    const updatedParticipants = [...gameParticipants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value,
    };
    
    // If heroId is updated, also update heroName
    if (field === 'heroId') {
      const hero = heroes.find(h => h.id === value);
      if (hero) {
        updatedParticipants[index].heroName = hero.name;
      }
    }
    
    setGameParticipants(updatedParticipants);
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Log a Game</h2>
      <Form {...gameLogForm}>
        <form onSubmit={gameLogForm.handleSubmit(onLogGame)} className="space-y-6">
          {/* Date Picker */}
          <FormField
            control={gameLogForm.control}
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
                          "w-[240px] pl-3 text-left font-normal",
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
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Players Section */}
          <GameParticipants
            participants={gameParticipants}
            players={players}
            heroes={heroes}
            onAddPlayer={addPlayerToGame}
            onRemovePlayer={removePlayerFromGame}
            onUpdateParticipant={updateParticipant}
          />

          {/* Victory Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Winning Team */}
            <FormField
              control={gameLogForm.control}
              name="winningTeam"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Winning Team</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Atlantis" id="atlantis" />
                        <label htmlFor="atlantis">Atlantis</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Blight" id="blight" />
                        <label htmlFor="blight">Blight</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Victory Method */}
            <FormField
              control={gameLogForm.control}
              name="victoryMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Victory Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Wave Counter" id="wave" />
                        <label htmlFor="wave">Wave Counter</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Base Push" id="base" />
                        <label htmlFor="base">Base Push</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Hero Kills" id="kills" />
                        <label htmlFor="kills">Hero Kills</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={gameParticipants.length < 2 || gameParticipants.some(p => !p.heroId)}
          >
            <TrophyIcon className="mr-2 h-4 w-4" />
            Log Game
          </Button>
        </form>
      </Form>
    </div>
  );
};
