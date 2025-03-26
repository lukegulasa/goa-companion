
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Shuffle, List, ListTree, Dice5, Users, Check, Ban } from 'lucide-react';
import DraftSetupCard from '@/components/draft/DraftSetupCard';
import DraftInProgress from '@/components/draft/DraftInProgress';
import DraftResults from '@/components/draft/DraftResults';
import { useIsMobile } from '@/hooks/use-mobile';

export type DraftMode = 'all-random' | 'all-pick' | 'single-draft' | 'random-draft' | 'player-draft' | 'pick-ban';
export type DraftState = 'setup' | 'in-progress' | 'completed';

const DraftPage = () => {
  const [selectedMode, setSelectedMode] = useState<DraftMode>('all-random');
  const [draftState, setDraftState] = useState<DraftState>('setup');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(8).fill(''));
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(Array(8).fill(''));
  const [completedDraftData, setCompletedDraftData] = useState<any[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const modeDescriptions = {
    'all-random': 'Randomly select heroes for each player.',
    'all-pick': 'Players pick a hero to play out of all available heroes (starting with the team showing on the Tie breaker coin and alternating between teams).',
    'single-draft': 'Give each player 3 heroes randomly. Players take turns to pick a hero to play out of those dealt to them.',
    'random-draft': 'Randomly select a number of heroes equal to the number of players plus 2. Players pick a hero to play out of the selected heroes.',
    'player-draft': 'Select two of the most experienced players as captains for each team. Using any of the above methods, select a hero for each player.',
    'pick-ban': 'Each team collectively chooses a hero to pick or ban. The team showing on the Tie Breaker coin is "Team A" the other team is "Team B".'
  };

  const modeIcons = {
    'all-random': <Shuffle className="w-5 h-5 mr-2" />,
    'all-pick': <List className="w-5 h-5 mr-2" />,
    'single-draft': <ListTree className="w-5 h-5 mr-2" />,
    'random-draft': <Dice5 className="w-5 h-5 mr-2" />,
    'player-draft': <Users className="w-5 h-5 mr-2" />,
    'pick-ban': <div className="flex mr-2"><Check className="w-5 h-5" /><Ban className="w-5 h-5" /></div>,
  };

  const handleSelectPlayer = (index: number, playerId: string) => {
    const newSelectedPlayers = [...selectedPlayers];
    newSelectedPlayers[index] = playerId;
    setSelectedPlayers(newSelectedPlayers);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const startDraft = () => {
    const filledNames = playerNames.slice(0, playerCount).filter(name => name.trim() !== '');
    if (filledNames.length < playerCount) {
      toast({
        title: "Missing Player Names",
        description: `Please provide names for all ${playerCount} players.`,
        variant: "destructive",
      });
      return;
    }
    
    if (selectedMode) {
      setDraftState('in-progress');
    }
  };

  const resetDraft = () => {
    setDraftState('setup');
    setSelectedMode('all-random');
    setCompletedDraftData([]);
  };

  const onDraftComplete = (draftData: any[]) => {
    setCompletedDraftData(draftData);
    setDraftState('completed');
  };

  return (
    <div className="container max-w-6xl mx-auto pt-4 px-4 sm:px-6 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Hero Draft</h1>
        
        {draftState === 'setup' && (
          <DraftSetupCard
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            playerNames={playerNames}
            selectedPlayers={selectedPlayers}
            onSelectPlayer={handleSelectPlayer}
            handlePlayerNameChange={handlePlayerNameChange}
            startDraft={startDraft}
          />
        )}

        {draftState !== 'setup' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
          >
            <DraftInProgress
              selectedMode={selectedMode}
              playerCount={playerCount}
              playerNames={playerNames}
              draftState={draftState}
              completedDraftData={completedDraftData}
              onDraftComplete={onDraftComplete}
              onResetDraft={resetDraft}
              modeDescriptions={modeDescriptions}
              modeIcons={modeIcons}
            />

            {draftState === 'completed' && completedDraftData.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Draft Results</CardTitle>
                  <CardDescription>
                    Log this draft as a completed game to update hero statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DraftResults 
                    completedDraftData={completedDraftData} 
                    onResetDraft={resetDraft} 
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DraftPage;
