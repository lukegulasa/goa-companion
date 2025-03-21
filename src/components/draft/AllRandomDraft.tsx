
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useHeroes } from '@/hooks/use-heroes';
import { Badge } from '@/components/ui/badge';
import HeroCard from '@/components/HeroCard';
import { motion } from 'framer-motion';
import { useHeroStats } from '@/hooks/use-hero-stats';
import { getHeroWinRate } from '@/lib/hero-stats-utils';

interface AllRandomDraftProps {
  playerCount: number;
  playerNames?: string[];
  onComplete: (draftData?: any[]) => void;
}

const AllRandomDraft: React.FC<AllRandomDraftProps> = ({ 
  playerCount, 
  playerNames = [], 
  onComplete 
}) => {
  const { heroes } = useHeroes();
  const { heroStats } = useHeroStats();
  const [isComplete, setIsComplete] = useState(false);
  const [selectedHeroes, setSelectedHeroes] = useState<{
    id: number;
    team: 'Red' | 'Blue';
    name: string;
    hero: any;
    playerName: string;
  }[]>([]);

  // Complete hero selection process
  const handleDraftComplete = () => {
    setIsComplete(true);
    
    // Prepare draft data for the parent component
    const draftData = selectedHeroes.map(selection => ({
      id: selection.playerName ? selection.playerName.toLowerCase().replace(/\s+/g, '-') : `player-${selection.id}`,
      name: selection.playerName || `Player ${selection.id}`,
      team: selection.team,
      heroId: selection.hero.id,
      heroName: selection.hero.name
    }));
    
    // Notify parent component
    onComplete(draftData);
  };

  const getWinRateText = (heroId: number) => {
    const winRate = getHeroWinRate(heroId, heroStats);
    if (winRate === null) return 'No data';
    return `${winRate}% win rate`;
  };

  // Randomize hero selection
  const randomizeHeroes = () => {
    // Reset draft state
    setIsComplete(false);
    
    // Ensure we have enough heroes
    if (heroes.length < playerCount) {
      console.error("Not enough heroes for all players");
      return;
    }
    
    // Randomly select heroes for each player
    const shuffled = [...heroes].sort(() => 0.5 - Math.random());
    const newSelections = [];
    
    for (let i = 0; i < playerCount; i++) {
      const team = i < Math.ceil(playerCount / 2) ? 'Red' : 'Blue';
      newSelections.push({
        id: i + 1,
        team,
        name: `Player ${i + 1}`,
        hero: shuffled[i],
        playerName: playerNames[i] || `Player ${i + 1}`
      });
    }
    
    setSelectedHeroes(newSelections);
  };

  // Auto-randomize on first load
  useEffect(() => {
    randomizeHeroes();
  }, [playerCount, playerNames]);

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Random Draft</h2>
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={randomizeHeroes}
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Randomize Again
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 text-red-600">Red Team</h3>
            <motion.div 
              className="space-y-4"
              variants={containerAnimation}
              initial="hidden"
              animate="show"
            >
              {selectedHeroes
                .filter(item => item.team === 'Red')
                .map(item => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-center justify-between"
                    variants={itemAnimation}
                  >
                    <div className="flex-1">
                      <div className="mb-1">{item.playerName}</div>
                      <Badge variant="outline">{getWinRateText(item.hero.id)}</Badge>
                    </div>
                    <div className="w-40">
                      <HeroCard hero={item.hero} onClick={() => {}} />
                    </div>
                  </motion.div>
                ))
              }
            </motion.div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 text-blue-600">Blue Team</h3>
            <motion.div 
              className="space-y-4"
              variants={containerAnimation}
              initial="hidden"
              animate="show"
            >
              {selectedHeroes
                .filter(item => item.team === 'Blue')
                .map(item => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-center justify-between"
                    variants={itemAnimation}
                  >
                    <div className="flex-1">
                      <div className="mb-1">{item.playerName}</div>
                      <Badge variant="outline">{getWinRateText(item.hero.id)}</Badge>
                    </div>
                    <div className="w-40">
                      <HeroCard hero={item.hero} onClick={() => {}} />
                    </div>
                  </motion.div>
                ))
              }
            </motion.div>
          </CardContent>
        </Card>
      </div>
      
      {!isComplete && (
        <Button 
          onClick={handleDraftComplete} 
          className="w-full"
          disabled={selectedHeroes.length !== playerCount}
        >
          Confirm Draft
        </Button>
      )}
    </div>
  );
};

export default AllRandomDraft;
