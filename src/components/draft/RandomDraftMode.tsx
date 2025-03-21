
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import { motion } from 'framer-motion';
import HeroCard from '@/components/HeroCard';
import { Shuffle, ArrowRight, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RandomDraftModeProps {
  playerCount: number;
  onComplete: () => void;
}

const RandomDraftMode: React.FC<RandomDraftModeProps> = ({ playerCount, onComplete }) => {
  const { heroes } = useHeroes();
  const { toast } = useToast();
  
  const [heroPool, setHeroPool] = useState<Hero[]>([]);
  const [teamATurn, setTeamATurn] = useState(true);
  const [teamA, setTeamA] = useState<Hero[]>([]);
  const [teamB, setTeamB] = useState<Hero[]>([]);
  const [currentHero, setCurrentHero] = useState<Hero | null>(null);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [starFilters, setStarFilters] = useState<number[]>([]);
  
  // Calculate how many heroes each team needs to pick
  const heroesPerTeam = playerCount / 2;
  
  // Apply star filters to the heroes
  const filteredHeroes = React.useMemo(() => {
    if (starFilters.length === 0) return heroes;
    return heroes.filter(hero => starFilters.includes(hero.stars));
  }, [heroes, starFilters]);
  
  // Generate the hero pool on initial render or when filters change
  useEffect(() => {
    generateHeroPool();
  }, [filteredHeroes, playerCount]);
  
  // Reset state when draft completes
  useEffect(() => {
    if (teamA.length === heroesPerTeam && teamB.length === heroesPerTeam) {
      setIsDraftComplete(true);
    }
  }, [teamA.length, teamB.length, heroesPerTeam]);
  
  const generateHeroPool = () => {
    if (filteredHeroes.length < playerCount + 2) {
      toast({
        title: "Not enough heroes",
        description: "There aren't enough heroes available for this draft mode with the current filters.",
        variant: "destructive",
      });
      return;
    }
    
    // Shuffle filtered heroes and select pool size of playerCount + 2
    const shuffled = [...filteredHeroes].sort(() => 0.5 - Math.random());
    const pool = shuffled.slice(0, playerCount + 2);
    setHeroPool(pool);
    
    // Reset teams
    setTeamA([]);
    setTeamB([]);
    setTeamATurn(true);
    setIsDraftComplete(false);
  };
  
  const toggleStarFilter = (star: number) => {
    setStarFilters(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star) 
        : [...prev, star]
    );
  };
  
  const selectHero = (hero: Hero) => {
    setCurrentHero(hero);
    setIsDialogOpen(true);
  };
  
  const confirmSelection = () => {
    if (!currentHero) return;
    
    if (teamATurn) {
      setTeamA([...teamA, currentHero]);
    } else {
      setTeamB([...teamB, currentHero]);
    }
    
    // Remove selected hero from pool
    setHeroPool(heroPool.filter(h => h.id !== currentHero.id));
    
    // Switch turns
    setTeamATurn(!teamATurn);
    setCurrentHero(null);
    setIsDialogOpen(false);
    
    toast({
      title: `${teamATurn ? 'Team A' : 'Team B'} picked ${currentHero.name}`,
      description: `${teamATurn ? 'Team B' : 'Team A'}'s turn to pick`,
    });
  };
  
  const cancelSelection = () => {
    setCurrentHero(null);
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Random Draft</h3>
        <Button 
          onClick={generateHeroPool} 
          variant="outline" 
          size="sm"
          className="flex items-center"
          disabled={isDraftComplete}
        >
          <Shuffle className="mr-2 h-4 w-4" />
          New Hero Pool
        </Button>
      </div>
      
      {/* Star filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium flex items-center mr-1">Filter by stars:</span>
        {[1, 2, 3, 4].map((star) => (
          <Toggle
            key={star}
            pressed={starFilters.includes(star)}
            onPressedChange={() => toggleStarFilter(star)}
            variant="outline"
            size="sm"
            className="h-8 px-3 flex items-center gap-1"
          >
            {star}
            <Star className={`h-3.5 w-3.5 ${starFilters.includes(star) ? "fill-yellow-400" : ""}`} />
          </Toggle>
        ))}
        {starFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStarFilters([])}
            className="h-8 px-3"
          >
            Clear
          </Button>
        )}
      </div>
      
      {!isDraftComplete && (
        <div className="bg-muted/50 p-4 rounded-md mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${teamATurn ? 'bg-blue-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">{teamATurn ? 'Team A' : 'Team B'}'s turn to pick</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Team A: {teamA.length}/{heroesPerTeam} | Team B: {teamB.length}/{heroesPerTeam}
            </div>
          </div>
        </div>
      )}
      
      {heroPool.length > 0 && !isDraftComplete && (
        <div>
          <h3 className="text-md font-medium mb-3">Available Hero Pool ({heroPool.length})</h3>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {heroPool.map(hero => (
              <motion.div key={hero.id} variants={item} className="cursor-pointer" onClick={() => selectHero(hero)}>
                <HeroCard hero={hero} onClick={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {teamA.length > 0 && (
        <div>
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
            {teamA.map(hero => (
              <motion.div key={hero.id} variants={item}>
                <HeroCard hero={hero} onClick={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {teamB.length > 0 && (
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
            {teamB.map(hero => (
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
              {teamATurn ? 'Team A' : 'Team B'}, do you want to pick {currentHero?.name}?
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

export default RandomDraftMode;
