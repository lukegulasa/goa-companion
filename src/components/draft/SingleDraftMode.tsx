
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import { motion } from 'framer-motion';
import HeroCard from '@/components/HeroCard';
import { Shuffle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface PlayerDraft {
  id: number;
  team: 'A' | 'B';
  options: Hero[];
  selected?: Hero;
}

interface SingleDraftModeProps {
  playerCount: number;
  onComplete: () => void;
}

const SingleDraftMode: React.FC<SingleDraftModeProps> = ({ playerCount, onComplete }) => {
  const { heroes } = useHeroes();
  const { toast } = useToast();
  
  const [players, setPlayers] = useState<PlayerDraft[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  
  const playersPerTeam = playerCount / 2;
  
  // Initialize players on component mount
  useEffect(() => {
    initializeDraft();
  }, [heroes, playerCount]);
  
  // Check if draft is complete
  useEffect(() => {
    const allSelected = players.every(player => player.selected);
    if (players.length > 0 && allSelected) {
      setIsDraftComplete(true);
    }
  }, [players]);
  
  const initializeDraft = () => {
    if (heroes.length < playerCount * 3) {
      toast({
        title: "Not enough heroes",
        description: "There aren't enough heroes available for this draft mode.",
        variant: "destructive",
      });
      return;
    }
    
    // Shuffle all heroes
    const shuffled = [...heroes].sort(() => 0.5 - Math.random());
    
    // Create player drafts
    const newPlayers: PlayerDraft[] = [];
    
    for (let i = 0; i < playerCount; i++) {
      // Get 3 unique heroes for this player
      const startIndex = i * 3;
      const playerOptions = shuffled.slice(startIndex, startIndex + 3);
      
      newPlayers.push({
        id: i + 1,
        team: i < playersPerTeam ? 'A' : 'B',
        options: playerOptions
      });
    }
    
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setIsDraftComplete(false);
  };
  
  const selectHero = (hero: Hero) => {
    setSelectedHero(hero);
    setIsDialogOpen(true);
  };
  
  const confirmSelection = () => {
    if (!selectedHero) return;
    
    // Update the current player's selection
    setPlayers(prev => 
      prev.map((player, idx) => 
        idx === currentPlayerIndex 
          ? { ...player, selected: selectedHero }
          : player
      )
    );
    
    // Move to next player or complete
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
      
      toast({
        title: `Player ${players[currentPlayerIndex].id} selected ${selectedHero.name}`,
        description: `Player ${players[currentPlayerIndex + 1].id}'s turn to pick`,
      });
    } else {
      toast({
        title: `Player ${players[currentPlayerIndex].id} selected ${selectedHero.name}`,
        description: "Draft complete!",
      });
    }
    
    setSelectedHero(null);
    setIsDialogOpen(false);
  };
  
  const cancelSelection = () => {
    setSelectedHero(null);
    setIsDialogOpen(false);
  };
  
  // Container animation
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
  
  const getCurrentPlayer = () => {
    return players[currentPlayerIndex] || null;
  };
  
  const getTeamAHeroes = () => {
    return players
      .filter(player => player.team === 'A' && player.selected)
      .map(player => player.selected!);
  };
  
  const getTeamBHeroes = () => {
    return players
      .filter(player => player.team === 'B' && player.selected)
      .map(player => player.selected!);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Single Draft</h3>
        <Button 
          onClick={initializeDraft} 
          variant="outline" 
          size="sm"
          className="flex items-center"
          disabled={!isDraftComplete && players.length > 0}
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Reset Draft
        </Button>
      </div>
      
      {players.length > 0 && !isDraftComplete && (
        <div className="bg-muted/50 p-4 rounded-md mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCurrentPlayer()?.team === 'A' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">
                Player {getCurrentPlayer()?.id}'s turn ({getCurrentPlayer()?.team === 'A' ? 'Team A' : 'Team B'})
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Select one hero from your three options
            </div>
          </div>
        </div>
      )}
      
      {players.length > 0 && !isDraftComplete && getCurrentPlayer() && (
        <div>
          <h3 className="text-md font-medium mb-3">Your Hero Options</h3>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {getCurrentPlayer()?.options.map(hero => (
              <motion.div key={hero.id} variants={item} className="cursor-pointer" onClick={() => selectHero(hero)}>
                <HeroCard hero={hero} onClick={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {getTeamAHeroes().length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Team A Picks
          </h3>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {getTeamAHeroes().map(hero => (
              <motion.div key={hero.id} variants={item}>
                <HeroCard hero={hero} onClick={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {getTeamBHeroes().length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Team B Picks
          </h3>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {getTeamBHeroes().map(hero => (
              <motion.div key={hero.id} variants={item}>
                <HeroCard hero={hero} onClick={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {isDraftComplete && (
        <div className="flex justify-end pt-4">
          <Button onClick={onComplete}>
            Confirm Draft
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Player {getCurrentPlayer()?.id}, do you want to pick {selectedHero?.name}?
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

export default SingleDraftMode;
