
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import HeroCard from '@/components/HeroCard';
import { Shuffle } from 'lucide-react';

interface AllRandomDraftProps {
  playerCount: number;
  onComplete: () => void;
}

const AllRandomDraft: React.FC<AllRandomDraftProps> = ({ playerCount, onComplete }) => {
  const { heroes } = useHeroes();
  const [selectedHeroes, setSelectedHeroes] = useState<Hero[]>([]);
  const [teamA, setTeamA] = useState<Hero[]>([]);
  const [teamB, setTeamB] = useState<Hero[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  const shuffleAndDraft = () => {
    if (heroes.length < playerCount) {
      toast({
        title: "Not enough heroes",
        description: "There aren't enough heroes available for the draft.",
        variant: "destructive",
      });
      return;
    }

    // Shuffle all heroes
    const shuffled = [...heroes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, playerCount);
    setSelectedHeroes(selected);

    // Split into teams
    const playersPerTeam = playerCount / 2;
    setTeamA(selected.slice(0, playersPerTeam));
    setTeamB(selected.slice(playersPerTeam, playerCount));
    
    setIsReady(true);
  };

  useEffect(() => {
    shuffleAndDraft();
  }, [heroes, playerCount]);

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
        <h3 className="text-lg font-semibold">All Random Draft</h3>
        <Button 
          onClick={shuffleAndDraft} 
          variant="outline" 
          size="sm"
          className="flex items-center"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Shuffle Again
        </Button>
      </div>

      {isReady && (
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-3 flex items-center">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Team A
            </h3>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
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

          <div>
            <h3 className="text-md font-medium mb-3 flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Team B
            </h3>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
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

          <div className="flex justify-end pt-4">
            <Button onClick={onComplete}>
              Confirm Draft
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRandomDraft;
