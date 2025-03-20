
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import { motion } from 'framer-motion';
import HeroCard from '@/components/HeroCard';
import { Check, Ban, ArrowRight, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface DraftAction {
  team: 'A' | 'B';
  action: 'pick' | 'ban';
}

interface PickBanDraftModeProps {
  playerCount: number;
  onComplete: () => void;
}

const PickBanDraftMode: React.FC<PickBanDraftModeProps> = ({ playerCount, onComplete }) => {
  const { heroes } = useHeroes();
  const { toast } = useToast();
  
  const [availableHeroes, setAvailableHeroes] = useState<Hero[]>([]);
  const [bannedHeroes, setBannedHeroes] = useState<Hero[]>([]);
  const [teamA, setTeamA] = useState<Hero[]>([]);
  const [teamB, setTeamB] = useState<Hero[]>([]);
  const [draftSequence, setDraftSequence] = useState<DraftAction[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  
  // Initialize the draft on component mount
  useEffect(() => {
    initializeDraft();
  }, [heroes, playerCount]);
  
  // Check if draft is complete
  useEffect(() => {
    if (draftSequence.length > 0 && currentStep >= draftSequence.length) {
      setIsDraftComplete(true);
    }
  }, [currentStep, draftSequence]);
  
  const initializeDraft = () => {
    // Set available heroes
    setAvailableHeroes([...heroes]);
    setBannedHeroes([]);
    setTeamA([]);
    setTeamB([]);
    setCurrentStep(0);
    setIsDraftComplete(false);
    
    // Create draft sequence based on player count
    const sequence: DraftAction[] = [];
    
    if (playerCount === 4) {
      // 4 players sequence
      sequence.push({ team: 'A', action: 'ban' });
      sequence.push({ team: 'B', action: 'ban' });
      sequence.push({ team: 'A', action: 'pick' });
      sequence.push({ team: 'B', action: 'pick' });
      sequence.push({ team: 'B', action: 'ban' });
      sequence.push({ team: 'A', action: 'ban' });
      sequence.push({ team: 'B', action: 'pick' });
      sequence.push({ team: 'A', action: 'pick' });
    } else if (playerCount === 6) {
      // 6 players sequence (same as 4 players plus additional steps)
      sequence.push({ team: 'A', action: 'ban' });
      sequence.push({ team: 'B', action: 'ban' });
      sequence.push({ team: 'A', action: 'pick' });
      sequence.push({ team: 'B', action: 'pick' });
      sequence.push({ team: 'B', action: 'ban' });
      sequence.push({ team: 'A', action: 'ban' });
      sequence.push({ team: 'B', action: 'pick' });
      sequence.push({ team: 'A', action: 'pick' });
      sequence.push({ team: 'A', action: 'ban' });
      sequence.push({ team: 'B', action: 'ban' });
      sequence.push({ team: 'B', action: 'pick' });
      sequence.push({ team: 'A', action: 'pick' });
    }
    
    setDraftSequence(sequence);
  };
  
  const getCurrentAction = (): DraftAction | null => {
    if (currentStep < draftSequence.length) {
      return draftSequence[currentStep];
    }
    return null;
  };
  
  const selectHero = (hero: Hero) => {
    setSelectedHero(hero);
    setIsDialogOpen(true);
  };
  
  const confirmSelection = () => {
    if (!selectedHero) return;
    
    const currentAction = getCurrentAction();
    if (!currentAction) return;
    
    if (currentAction.action === 'ban') {
      // Add hero to banned list
      setBannedHeroes(prev => [...prev, selectedHero]);
      
      toast({
        title: `Team ${currentAction.team} banned ${selectedHero.name}`,
        description: `${selectedHero.name} has been removed from the draft pool.`,
      });
    } else {
      // Add hero to team
      if (currentAction.team === 'A') {
        setTeamA(prev => [...prev, selectedHero]);
      } else {
        setTeamB(prev => [...prev, selectedHero]);
      }
      
      toast({
        title: `Team ${currentAction.team} picked ${selectedHero.name}`,
        description: `${selectedHero.name} has been added to Team ${currentAction.team}.`,
      });
    }
    
    // Remove hero from available heroes
    setAvailableHeroes(prev => prev.filter(h => h.id !== selectedHero.id));
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
    
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Pick/Ban Draft</h3>
        <Button 
          onClick={initializeDraft} 
          variant="outline" 
          size="sm"
          className="flex items-center"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Reset Draft
        </Button>
      </div>
      
      {!isDraftComplete && getCurrentAction() && (
        <div className="bg-muted/50 p-4 rounded-md mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCurrentAction()?.team === 'A' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">
                Team {getCurrentAction()?.team}'s turn to {getCurrentAction()?.action}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {getCurrentAction()?.action === 'pick' ? (
                <Check className="mr-1 h-4 w-4" />
              ) : (
                <Ban className="mr-1 h-4 w-4" />
              )}
              <span>
                Step {currentStep + 1} of {draftSequence.length}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {teamA.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span>Team A Picks ({teamA.length}/{playerCount/2})</span>
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
            <span>Team B Picks ({teamB.length}/{playerCount/2})</span>
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
      
      {bannedHeroes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3 flex items-center">
            <Ban className="mr-2 h-4 w-4 text-red-500" />
            <span>Banned Heroes ({bannedHeroes.length})</span>
          </h3>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {bannedHeroes.map(hero => (
              <motion.div key={hero.id} variants={item} className="relative">
                <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex items-center justify-center">
                  <Ban className="h-8 w-8 text-red-500" />
                </div>
                <HeroCard hero={hero} onClick={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {!isDraftComplete && getCurrentAction() && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3 flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>Available Heroes ({availableHeroes.length})</span>
          </h3>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {availableHeroes.map(hero => (
              <motion.div key={hero.id} variants={item} className="cursor-pointer" onClick={() => selectHero(hero)}>
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
              Team {getCurrentAction()?.team}, do you want to {getCurrentAction()?.action} {selectedHero?.name}?
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

export default PickBanDraftMode;
