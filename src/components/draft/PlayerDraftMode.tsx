
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useHeroes } from '@/hooks/use-heroes';
import { Hero } from '@/lib/types';
import { ArrowRight, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import PlayerDraftSetup from './PlayerDraftSetup';
import TeamDisplay from './TeamDisplay';
import PlayerSelector from './PlayerSelector';
import DraftConfirmDialog from './DraftConfirmDialog';
import DraftStatusBanner from './DraftStatusBanner';

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
        <PlayerDraftSetup
          draftMethod={draftMethod}
          setDraftMethod={setDraftMethod}
          playerCount={playerCount}
          playerNamesState={playerNamesState}
          handlePlayerNameChange={handlePlayerNameChange}
          captainA={captainA}
          setCaptainA={setCaptainA}
          captainB={captainB}
          setCaptainB={setCaptainB}
          setupDraft={setupDraft}
        />
      )}
      
      {draftStage === 'team-draft' && (
        <>
          <DraftStatusBanner currentCaptain={currentCaptain} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamDisplay 
              team="A"
              players={players}
              captainId={captainA}
              teamColor="bg-blue-500"
              teamName="Team A"
            />
            
            <TeamDisplay 
              team="B"
              players={players}
              captainId={captainB}
              teamColor="bg-red-500"
              teamName="Team B"
            />
          </div>
          
          <PlayerSelector 
            players={players}
            onSelectPlayer={selectPlayer}
          />
        </>
      )}
      
      <DraftConfirmDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPlayerName={players.find(p => p.id === selectedPlayer)?.name}
        currentTeam={currentCaptain}
        onConfirm={confirmSelection}
        onCancel={cancelSelection}
      />
    </div>
  );
};

export default PlayerDraftMode;
