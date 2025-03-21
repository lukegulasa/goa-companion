
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import { motion } from 'framer-motion';
import HeroCard from '@/components/HeroCard';
import { 
  Shuffle, 
  ArrowRight, 
  Users,
  User 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Player {
  id: number;
  name: string;
  hero: Hero;
  team?: 'A' | 'B';
}

interface PlayerDraftModeProps {
  playerCount: number;
  playerNames?: string[];
  onComplete: (draftData: any[]) => void;
}

type DraftStage = 'setup' | 'hero-selection' | 'team-draft' | 'complete';

const PlayerDraftMode: React.FC<PlayerDraftModeProps> = ({ 
  playerCount, 
  playerNames = [],
  onComplete 
}) => {
  const { heroes } = useHeroes();
  const { toast } = useToast();
  
  const [draftMethod, setDraftMethod] = useState<'all-random' | 'all-pick'>('all-random');
  const [players, setPlayers] = useState<Player[]>([]);
  const [captainA, setCaptainA] = useState<number | null>(null);
  const [captainB, setCaptainB] = useState<number | null>(null);
  const [draftStage, setDraftStage] = useState<DraftStage>('setup');
  const [currentCaptain, setCurrentCaptain] = useState<'A' | 'B'>('A');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playerNamesState, setPlayerNames] = useState<string[]>(() => {
    // Initialize with provided player names or empty strings
    return playerNames.length > 0 ? [...playerNames] : Array(playerCount).fill('');
  });
  
  useEffect(() => {
    if (draftStage === 'hero-selection' && players.length === 0) {
      if (draftMethod === 'all-random') {
        assignRandomHeroes();
      }
    }
  }, [draftStage, draftMethod]);
  
  const setupDraft = () => {
    const emptyNames = playerNamesState.filter(name => !name.trim()).length;
    if (emptyNames > 0) {
      toast({
        title: "Missing player names",
        description: `Please enter names for all ${playerCount} players.`,
        variant: "destructive",
      });
      return;
    }
    
    if (captainA === null || captainB === null) {
      toast({
        title: "Missing captains",
        description: "Please select captains for both teams.",
        variant: "destructive",
      });
      return;
    }
    
    if (captainA === captainB) {
      toast({
        title: "Invalid captains",
        description: "The same player cannot be captain for both teams.",
        variant: "destructive",
      });
      return;
    }
    
    setDraftStage('hero-selection');
  };
  
  const assignRandomHeroes = () => {
    if (heroes.length < playerCount) {
      toast({
        title: "Not enough heroes",
        description: "There aren't enough heroes available for this draft mode.",
        variant: "destructive",
      });
      return;
    }
    
    const shuffled = [...heroes].sort(() => 0.5 - Math.random());
    const newPlayers: Player[] = [];
    
    for (let i = 0; i < playerCount; i++) {
      newPlayers.push({
        id: i,
        name: playerNamesState[i] || `Player ${i + 1}`,
        hero: shuffled[i],
        team: i === captainA ? 'A' : i === captainB ? 'B' : undefined
      });
    }
    
    setPlayers(newPlayers);
    setCurrentCaptain('A');
    setDraftStage('team-draft');
    
    toast({
      title: "Heroes assigned",
      description: "Captains can now start drafting their teams.",
    });
  };
  
  const selectPlayer = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.team) {
      return;
    }
    
    setSelectedPlayer(playerId);
    setIsDialogOpen(true);
  };
  
  const confirmSelection = () => {
    if (selectedPlayer === null) return;
    
    setPlayers(prev => 
      prev.map(player => 
        player.id === selectedPlayer 
          ? { ...player, team: currentCaptain }
          : player
      )
    );
    
    setCurrentCaptain(prev => prev === 'A' ? 'B' : 'A');
    
    const playerName = players.find(p => p.id === selectedPlayer)?.name;
    toast({
      title: `Team ${currentCaptain} drafted ${playerName}`,
      description: `Team ${currentCaptain === 'A' ? 'B' : 'A'}'s turn to draft`,
    });
    
    setSelectedPlayer(null);
    setIsDialogOpen(false);
    
    const undraftedPlayers = players.filter(p => !p.team).length - 1;
    if (undraftedPlayers === 0) {
      setDraftStage('complete');
      toast({
        title: "Draft complete!",
        description: "All players have been drafted to teams.",
      });
    }
  };
  
  const cancelSelection = () => {
    setSelectedPlayer(null);
    setIsDialogOpen(false);
  };
  
  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNamesState];
    newNames[index] = name;
    setPlayerNames(newNames);
  };
  
  const getTeamPlayers = (team: 'A' | 'B') => {
    return players.filter(player => player.team === team);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  const handleDraftComplete = () => {
    const draftData = players.map(player => ({
      id: player.name.toLowerCase().replace(/\s+/g, '-'),
      name: player.name,
      team: player.team === 'A' ? 'Red' : 'Blue',
      heroId: player.hero.id,
      heroName: player.hero.name
    }));
    
    onComplete(draftData);
  };
  
  if (draftStage === 'complete') {
    return (
      <div className="flex justify-end pt-4">
        <Button onClick={handleDraftComplete}>
          Confirm Draft
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Player Draft</h3>
        {draftStage !== 'setup' && (
          <Button 
            onClick={() => setDraftStage('setup')} 
            variant="outline" 
            size="sm"
            className="flex items-center"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Reset Draft
          </Button>
        )}
      </div>
      
      {draftStage === 'setup' && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="draft-method">Hero Selection Method</Label>
            <Select 
              value={draftMethod} 
              onValueChange={(value) => setDraftMethod(value as 'all-random' | 'all-pick')}
            >
              <SelectTrigger id="draft-method" className="w-full mt-1">
                <SelectValue placeholder="Select a draft method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-random">All Random</SelectItem>
                <SelectItem value="all-pick">All Pick (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              This determines how heroes are assigned to players before team drafting begins.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2 flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Player Names
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index}>
                  <Label htmlFor={`player-${index}`}>Player {index + 1}</Label>
                  <Input
                    id={`player-${index}`}
                    value={playerNamesState[index]}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="captain-a">Team A Captain</Label>
              <Select 
                value={captainA !== null ? captainA.toString() : undefined} 
                onValueChange={(value) => setCaptainA(parseInt(value))}
              >
                <SelectTrigger id="captain-a" className="w-full mt-1">
                  <SelectValue placeholder="Select Team A Captain" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: playerCount }).map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {playerNamesState[index] || `Player ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="captain-b">Team B Captain</Label>
              <Select 
                value={captainB !== null ? captainB.toString() : undefined}
                onValueChange={(value) => setCaptainB(parseInt(value))}
              >
                <SelectTrigger id="captain-b" className="w-full mt-1">
                  <SelectValue placeholder="Select Team B Captain" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: playerCount }).map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {playerNamesState[index] || `Player ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={setupDraft}>
              Continue to Hero Assignment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {draftStage === 'team-draft' && (
        <>
          <div className="bg-muted/50 p-4 rounded-md mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${currentCaptain === 'A' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                <span className="font-medium">
                  Team {currentCaptain} Captain's turn to draft
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Select a player to add to your team
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3 flex items-center">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Team A
              </h3>
              
              <div className="space-y-3">
                {getTeamPlayers('A').map(player => (
                  <div key={player.id} className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {player.id === captainA ? 'Captain • ' : ''}{player.hero.name}
                      </div>
                    </div>
                    <HeroCard hero={player.hero} onClick={() => {}} />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3 flex items-center">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Team B
              </h3>
              
              <div className="space-y-3">
                {getTeamPlayers('B').map(player => (
                  <div key={player.id} className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {player.id === captainB ? 'Captain • ' : ''}{player.hero.name}
                      </div>
                    </div>
                    <HeroCard hero={player.hero} onClick={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium mb-3 flex items-center">
              <User className="mr-2 h-4 w-4" />
              Available Players
            </h3>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {players.filter(player => !player.team).map(player => (
                <motion.div 
                  key={player.id} 
                  variants={item} 
                  className="flex items-center p-3 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => selectPlayer(player.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-muted-foreground">{player.hero.name}</div>
                  </div>
                  <HeroCard hero={player.hero} onClick={() => {}} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Team {currentCaptain} Captain, do you want to draft {players.find(p => p.id === selectedPlayer)?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={cancelSelection}>Cancel</Button>
            <Button onClick={confirmSelection}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerDraftMode;
