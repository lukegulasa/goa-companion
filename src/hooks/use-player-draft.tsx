
import { useState, useEffect } from 'react';
import { Hero } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface Player {
  id: number;
  name: string;
  hero: Hero;
  team?: 'A' | 'B';
}

type DraftStage = 'setup' | 'hero-selection' | 'team-draft' | 'complete';

export function usePlayerDraft(playerCount: number, playerNames: string[], heroesData: Hero[]) {
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
    if (heroesData.length < playerCount) {
      toast({
        title: "Not enough heroes",
        description: "There aren't enough heroes available for this draft mode.",
        variant: "destructive",
      });
      return;
    }
    
    const shuffled = [...heroesData].sort(() => 0.5 - Math.random());
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
  
  const resetDraft = () => {
    setDraftStage('setup');
  };
  
  const prepareDraftData = () => {
    return players.map(player => ({
      id: player.name.toLowerCase().replace(/\s+/g, '-'),
      name: player.name,
      team: player.team === 'A' ? 'Red' : 'Blue',
      heroId: player.hero.id,
      heroName: player.hero.name
    }));
  };

  return {
    draftMethod,
    setDraftMethod,
    players,
    captainA,
    setCaptainA,
    captainB,
    setCaptainB,
    draftStage,
    currentCaptain,
    selectedPlayer,
    isDialogOpen,
    setIsDialogOpen,
    playerNamesState,
    setupDraft,
    selectPlayer,
    confirmSelection,
    cancelSelection,
    handlePlayerNameChange,
    resetDraft,
    prepareDraftData
  };
}
