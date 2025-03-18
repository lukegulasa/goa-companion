
import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { format } from 'date-fns';
import { CalendarIcon, PlusIcon, TrashIcon, TrophyIcon } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Types for our game log
interface Player {
  id: string;
  name: string;
}

interface GamePlayer {
  playerId: string;
  playerName: string;
  team: 'Atlantis' | 'Blight';
  heroId: number;
  heroName: string;
}

interface Game {
  id: string;
  date: string; // ISO string
  players: GamePlayer[];
  winningTeam: 'Atlantis' | 'Blight';
  victoryMethod: 'Wave Counter' | 'Base Push' | 'Hero Kills';
}

// Form schema for validation
const newPlayerSchema = z.object({
  playerName: z.string().min(1, { message: "Player name is required" }),
});

const gameLogSchema = z.object({
  date: z.date(),
  winningTeam: z.enum(['Atlantis', 'Blight']),
  victoryMethod: z.enum(['Wave Counter', 'Base Push', 'Hero Kills']),
});

const GameStats: React.FC = () => {
  const [players, setPlayers] = useLocalStorage<Player[]>('game-players', []);
  const [gameLogs, setGameLogs] = useLocalStorage<Game[]>('game-logs', []);
  const [gameParticipants, setGameParticipants] = useState<GamePlayer[]>([]);
  const [activeTab, setActiveTab] = useState('log-game');
  const { heroes } = useHeroes();

  // Forms
  const newPlayerForm = useForm<{ playerName: string }>({
    resolver: zodResolver(newPlayerSchema),
    defaultValues: {
      playerName: '',
    },
  });

  const gameLogForm = useForm<z.infer<typeof gameLogSchema>>({
    resolver: zodResolver(gameLogSchema),
    defaultValues: {
      date: new Date(),
      winningTeam: 'Atlantis',
      victoryMethod: 'Wave Counter',
    },
  });

  // Add a new player
  const onAddPlayer = (data: { playerName: string }) => {
    const newPlayer = {
      id: Date.now().toString(),
      name: data.playerName.trim(),
    };
    setPlayers([...players, newPlayer]);
    newPlayerForm.reset();
  };

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

  // Log a new game
  const onLogGame = (data: z.infer<typeof gameLogSchema>) => {
    // Validate that we have players and they all have heroes selected
    if (gameParticipants.length < 2) {
      return; // Need at least 2 players
    }
    
    if (gameParticipants.some(p => !p.heroId)) {
      return; // All players need a hero
    }
    
    const newGame: Game = {
      id: Date.now().toString(),
      date: data.date.toISOString(),
      players: gameParticipants,
      winningTeam: data.winningTeam,
      victoryMethod: data.victoryMethod,
    };
    
    setGameLogs([...gameLogs, newGame]);
    
    // Reset the form
    gameLogForm.reset({ 
      date: new Date(),
      winningTeam: 'Atlantis',
      victoryMethod: 'Wave Counter'
    });
    setGameParticipants([]);
    setActiveTab('game-history');
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Game Statistics</h1>
        <p className="text-muted-foreground mt-1">Track your games and player statistics</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="log-game">Log a Game</TabsTrigger>
          <TabsTrigger value="game-history">Game History</TabsTrigger>
          <TabsTrigger value="player-stats">Player Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="log-game" className="space-y-8">
          {/* New Player Form */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
            <form onSubmit={newPlayerForm.handleSubmit(onAddPlayer)} className="flex gap-4">
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

          {/* Game Logger */}
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Game Participants</h3>
                    <Select onValueChange={addPlayerToGame}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Add player to game" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem 
                            key={player.id} 
                            value={player.id}
                            disabled={gameParticipants.some(p => p.playerId === player.id)}
                          >
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Game Participants Table */}
                  {gameParticipants.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Hero</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gameParticipants.map((participant, index) => (
                            <TableRow key={participant.playerId}>
                              <TableCell>{participant.playerName}</TableCell>
                              <TableCell>
                                <Select
                                  value={participant.team}
                                  onValueChange={(value) => 
                                    updateParticipant(index, 'team', value as 'Atlantis' | 'Blight')
                                  }
                                >
                                  <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Atlantis">Atlantis</SelectItem>
                                    <SelectItem value="Blight">Blight</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={participant.heroId.toString()}
                                  onValueChange={(value) => 
                                    updateParticipant(index, 'heroId', Number(value))
                                  }
                                >
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Select hero" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {heroes.map((hero) => (
                                      <SelectItem key={hero.id} value={hero.id.toString()}>
                                        {hero.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlayerFromGame(index)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex h-[100px] items-center justify-center rounded-md border border-dashed">
                      <p className="text-muted-foreground">
                        Add players to the game using the dropdown above
                      </p>
                    </div>
                  )}
                </div>

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
        </TabsContent>
        
        <TabsContent value="game-history" className="space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Game History</h2>
            
            {gameLogs.length > 0 ? (
              <div className="space-y-6">
                {gameLogs.map((game) => (
                  <div key={game.id} className="rounded-md border p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">
                          Game on {format(new Date(game.date), 'MMMM d, yyyy')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {game.winningTeam} won by {game.victoryMethod}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <TrophyIcon className="h-5 w-5 mr-1 text-yellow-500" />
                        <span className="font-medium">{game.winningTeam}</span>
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
                                  player.team === "Atlantis" 
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
          </div>
        </TabsContent>
        
        <TabsContent value="player-stats" className="space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Player Statistics</h2>
            
            {players.length > 0 ? (
              <div className="space-y-8">
                {players.map((player) => {
                  // Calculate player stats
                  const playerGames = gameLogs.filter(game => 
                    game.players.some(p => p.playerId === player.id)
                  );
                  
                  const gamesWon = playerGames.filter(game => {
                    const playerEntry = game.players.find(p => p.playerId === player.id);
                    return playerEntry && playerEntry.team === game.winningTeam;
                  });
                  
                  // Get hero usage stats
                  const heroUsage: Record<string, number> = {};
                  playerGames.forEach(game => {
                    const playerEntry = game.players.find(p => p.playerId === player.id);
                    if (playerEntry) {
                      heroUsage[playerEntry.heroName] = (heroUsage[playerEntry.heroName] || 0) + 1;
                    }
                  });
                  
                  // Sort heroes by usage
                  const heroStats = Object.entries(heroUsage)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3);
                    
                  return (
                    <div key={player.id} className="rounded-md border p-4">
                      <h3 className="text-lg font-medium mb-2">{player.name}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-background rounded-md">
                          <p className="text-sm text-muted-foreground">Games Played</p>
                          <p className="text-2xl font-bold">{playerGames.length}</p>
                        </div>
                        
                        <div className="p-3 bg-background rounded-md">
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                          <p className="text-2xl font-bold">
                            {playerGames.length > 0 
                              ? `${Math.round((gamesWon.length / playerGames.length) * 100)}%`
                              : '0%'}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-background rounded-md">
                          <p className="text-sm text-muted-foreground">Most Played Heroes</p>
                          {heroStats.length > 0 ? (
                            <div className="mt-1 space-y-1">
                              {heroStats.map(([hero, count]) => (
                                <div key={hero} className="flex justify-between">
                                  <span className="text-sm">{hero}</span>
                                  <span className="text-sm font-medium">{count} games</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm">No heroes played</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">No players added yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameStats;
