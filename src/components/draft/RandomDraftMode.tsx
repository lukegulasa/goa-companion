import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useHeroes } from '@/hooks/use-heroes';
import { Shuffle } from 'lucide-react';
import { DraftHeroCard } from './DraftHeroCard';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface RandomDraftModeProps {
  playerCount: number;
  playerNames?: string[];
  onComplete: (draftData: any[]) => void;
}

interface DraftSlot {
  playerNumber: number;
  team: 'Red' | 'Blue';
  heroId: number | null;
  heroName: string;
}

const RandomDraftMode: React.FC<RandomDraftModeProps> = ({ 
  playerCount, 
  playerNames = [],
  onComplete 
}) => {
  const { heroes } = useHeroes();
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);
  const [currentTeam, setCurrentTeam] = useState<'Red' | 'Blue'>('Red');
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [draftSlots, setDraftSlots] = useState<DraftSlot[]>([]);
  const [availableHeroes, setAvailableHeroes] = useState<typeof heroes>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const slots: DraftSlot[] = [];
    const teamsCount = Math.floor(playerCount / 2);
    
    for (let i = 0; i < playerCount; i++) {
      const team = i < teamsCount ? 'Red' : 'Blue';
      slots.push({
        playerNumber: i + 1,
        team,
        heroId: null,
        heroName: ''
      });
    }
    
    setDraftSlots(slots);
    
    const shuffledHeroes = [...heroes].sort(() => 0.5 - Math.random());
    setAvailableHeroes(shuffledHeroes.slice(0, playerCount + 2));
  }, [playerCount, heroes]);

  const handleHeroSelect = (heroId: number) => {
    if (draftSlots.some(slot => slot.heroId === heroId)) return;
    
    setSelectedHeroId(heroId);
  };

  const handleConfirmSelection = () => {
    if (selectedHeroId === null) return;

    const updatedSlots = draftSlots.map(slot => {
      if (slot.playerNumber === currentPlayer) {
        const hero = heroes.find(h => h.id === selectedHeroId);
        return {
          ...slot,
          heroId: selectedHeroId,
          heroName: hero ? hero.name : ''
        };
      }
      return slot;
    });
    
    setDraftSlots(updatedSlots);
    
    const nextPlayer = currentPlayer + 1;
    if (nextPlayer > playerCount) {
      setIsComplete(true);
    } else {
      setCurrentPlayer(nextPlayer);
      setCurrentTeam(currentTeam === 'Red' ? 'Blue' : 'Red');
      setSelectedHeroId(null);
    }
  };

  const handleComplete = () => {
    const draftData = draftSlots.map((slot, index) => ({
      id: playerNames[index] ? playerNames[index].toLowerCase().replace(/\s+/g, '-') : `player-${slot.playerNumber}`,
      name: playerNames[index] || `Player ${slot.playerNumber}`,
      team: slot.team,
      heroId: slot.heroId as number,
      heroName: slot.heroName
    }));

    onComplete(draftData);
  };

  if (isComplete) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Draft Complete!</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2 text-red-600">Red Team</h3>
            <div className="space-y-2">
              {draftSlots
                .filter(slot => slot.team === 'Red')
                .map(slot => (
                  <div key={slot.playerNumber} className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Player {slot.playerNumber}:</span>
                    <span>{slot.heroName}</span>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 text-blue-600">Blue Team</h3>
            <div className="space-y-2">
              {draftSlots
                .filter(slot => slot.team === 'Blue')
                .map(slot => (
                  <div key={slot.playerNumber} className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Player {slot.playerNumber}:</span>
                    <span>{slot.heroName}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        
        <Button onClick={handleComplete} className="w-full">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          <span className={currentTeam === 'Red' ? 'text-red-600' : 'text-blue-600'}>
            {currentTeam} Team
          </span> Picking
        </h2>
        <div className="text-sm font-medium">
          Player {currentPlayer} / {playerCount}
        </div>
      </div>
      
      <Card className={`border-2 ${currentTeam === 'Red' ? 'border-red-500' : 'border-blue-500'}`}>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">
            {currentTeam} Team Picks
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {draftSlots
              .filter(slot => slot.team === currentTeam)
              .map(slot => (
                <div key={slot.playerNumber} className="border rounded p-2">
                  <div className="text-xs text-muted-foreground mb-1">Player {slot.playerNumber}</div>
                  {slot.heroId ? (
                    <div className="font-medium">{slot.heroName}</div>
                  ) : (
                    slot.playerNumber === currentPlayer ? (
                      <div className="font-medium text-primary">Selecting...</div>
                    ) : (
                      <div className="text-muted-foreground">Not picked</div>
                    )
                  )}
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="font-medium mb-3">Random Hero Pool</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {availableHeroes.map(hero => (
            <DraftHeroCard 
              key={hero.id}
              hero={hero}
              isSelected={selectedHeroId === hero.id}
              isBanned={draftSlots.some(slot => slot.heroId === hero.id)}
              onClick={() => handleHeroSelect(hero.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleConfirmSelection}
          disabled={selectedHeroId === null}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default RandomDraftMode;

