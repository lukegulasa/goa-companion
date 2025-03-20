
import React, { useState } from 'react';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import HeroCard from '@/components/HeroCard';

interface AllPickDraftProps {
  playerCount: number;
  onComplete: () => void;
}

const AllPickDraft: React.FC<AllPickDraftProps> = ({ playerCount, onComplete }) => {
  const { heroes } = useHeroes();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamAHeroes, setTeamAHeroes] = useState<Hero[]>([]);
  const [teamBHeroes, setTeamBHeroes] = useState<Hero[]>([]);
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');
  const [selectedHeroes, setSelectedHeroes] = useState<Hero[]>([]);
  
  const playersPerTeam = playerCount / 2;
  const isTeamAComplete = teamAHeroes.length === playersPerTeam;
  const isTeamBComplete = teamBHeroes.length === playersPerTeam;
  const isDraftComplete = isTeamAComplete && isTeamBComplete;

  const filteredHeroes = heroes.filter(hero => {
    const isAlreadySelected = selectedHeroes.some(selected => selected.id === hero.id);
    if (isAlreadySelected) return false;
    
    if (!searchQuery) return true;
    return hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           hero.allTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleHeroSelect = (hero: Hero) => {
    const updatedSelected = [...selectedHeroes, hero];
    setSelectedHeroes(updatedSelected);
    
    if (currentTeam === 'A') {
      if (teamAHeroes.length < playersPerTeam) {
        setTeamAHeroes([...teamAHeroes, hero]);
        if (teamAHeroes.length + 1 < playersPerTeam || teamBHeroes.length >= playersPerTeam) {
          setCurrentTeam('B');
        }
      }
    } else {
      if (teamBHeroes.length < playersPerTeam) {
        setTeamBHeroes([...teamBHeroes, hero]);
        if (teamBHeroes.length + 1 < playersPerTeam || teamAHeroes.length >= playersPerTeam) {
          setCurrentTeam('A');
        }
      }
    }
  };

  const resetDraft = () => {
    setTeamAHeroes([]);
    setTeamBHeroes([]);
    setSelectedHeroes([]);
    setCurrentTeam('A');
  };

  // Container animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">All Pick Draft</h3>
        {selectedHeroes.length > 0 && (
          <Button variant="outline" size="sm" onClick={resetDraft}>
            Reset
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-muted-foreground" />
          <span className="text-sm">
            {!isDraftComplete ? (
              <>Current pick: <Badge variant={currentTeam === 'A' ? 'default' : 'destructive'}>Team {currentTeam}</Badge></>
            ) : (
              <>Draft complete</>
            )}
          </span>
        </div>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2">
            Team A: {teamAHeroes.length}/{playersPerTeam}
          </Badge>
          <Badge variant="outline">
            Team B: {teamBHeroes.length}/{playersPerTeam}
          </Badge>
        </div>
      </div>

      {!isDraftComplete && (
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search heroes by name or tag..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Team previews */}
      {(teamAHeroes.length > 0 || teamBHeroes.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Team A
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {teamAHeroes.map(hero => (
                <div key={hero.id} className="p-2 border rounded bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                        <span className="text-xs">{hero.stars}</span>
                      </div>
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-sm">{hero.name}</p>
                    </div>
                  </div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, playersPerTeam - teamAHeroes.length) }).map((_, i) => (
                <div key={`empty-a-${i}`} className="p-2 border border-dashed rounded bg-gray-50 dark:bg-gray-900/20">
                  <div className="flex items-center justify-center">
                    <p className="text-xs text-gray-500">Empty slot</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Team B
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {teamBHeroes.map(hero => (
                <div key={hero.id} className="p-2 border rounded bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-full">
                        <span className="text-xs">{hero.stars}</span>
                      </div>
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-sm">{hero.name}</p>
                    </div>
                  </div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, playersPerTeam - teamBHeroes.length) }).map((_, i) => (
                <div key={`empty-b-${i}`} className="p-2 border border-dashed rounded bg-gray-50 dark:bg-gray-900/20">
                  <div className="flex items-center justify-center">
                    <p className="text-xs text-gray-500">Empty slot</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isDraftComplete ? (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredHeroes.map(hero => (
            <motion.div 
              key={hero.id} 
              variants={item}
              className="cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleHeroSelect(hero)}
            >
              <HeroCard hero={hero} onClick={() => handleHeroSelect(hero)} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex justify-end mt-8">
          <Button onClick={onComplete}>
            Confirm Draft
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllPickDraft;
