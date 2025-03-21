
import React from 'react';
import { motion } from 'framer-motion';
import HeroCard from '@/components/HeroCard';
import { User } from 'lucide-react';
import { Hero } from '@/lib/types';

interface Player {
  id: number;
  name: string;
  hero: Hero;
  team?: 'A' | 'B';
}

interface PlayerSelectorProps {
  players: Player[];
  onSelectPlayer: (playerId: number) => void;
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({ players, onSelectPlayer }) => {
  const availablePlayers = players.filter(player => !player.team);
  
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
        {availablePlayers.map(player => (
          <motion.div 
            key={player.id} 
            variants={item} 
            className="flex items-center p-3 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onSelectPlayer(player.id)}
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
  );
};

export default PlayerSelector;
