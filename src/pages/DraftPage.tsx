import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shuffle, 
  List, 
  ListTree, 
  Dice5, 
  Users, 
  Check, 
  Ban, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DraftSetup from '@/components/draft/DraftSetup';
import AllRandomDraft from '@/components/draft/AllRandomDraft';
import AllPickDraft from '@/components/draft/AllPickDraft';
import SingleDraftMode from '@/components/draft/SingleDraftMode';
import RandomDraftMode from '@/components/draft/RandomDraftMode';
import PlayerDraftMode from '@/components/draft/PlayerDraftMode';
import PickBanDraftMode from '@/components/draft/PickBanDraftMode';
import DraftPlayerSelect from '@/components/draft/DraftPlayerSelect';
import LogDraftGame from '@/components/draft/LogDraftGame';
import { useToast } from '@/hooks/use-toast';

export type DraftMode = 'all-random' | 'all-pick' | 'single-draft' | 'random-draft' | 'player-draft' | 'pick-ban';
export type DraftState = 'setup' | 'in-progress' | 'completed';

const DraftPage = () => {
  const [selectedMode, setSelectedMode] = useState<DraftMode>('all-random');
  const [draftState, setDraftState] = useState<DraftState>('setup');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(8).fill(''));
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(Array(8).fill(''));
  const [completedDraftData, setCompletedDraftData] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const renderDraftComponent = () => {
    if (draftState === 'setup') {
      return (
        <>
          <DraftSetup 
            playerCount={playerCount} 
            setPlayerCount={setPlayerCount} 
          />
          
          <DraftPlayerSelect
            playerCount={playerCount}
            selectedPlayers={selectedPlayers}
            onSelectPlayer={handleSelectPlayer}
            playerNames={playerNames}
            setPlayerNames={handlePlayerNameChange}
          />
        </>
      );
    }

    const draftProps = {
      playerCount,
      playerNames: playerNames.slice(0, playerCount),
      onComplete: onDraftComplete
    };

    switch (selectedMode) {
      case 'all-random':
        return <AllRandomDraft {...draftProps} />;
      case 'all-pick':
        return <AllPickDraft {...draftProps} />;
      case 'single-draft':
        return <SingleDraftMode {...draftProps} />;
      case 'random-draft':
        return <RandomDraftMode {...draftProps} />;
      case 'player-draft':
        return <PlayerDraftMode {...draftProps} />;
      case 'pick-ban':
        return <PickBanDraftMode {...draftProps} />;
      default:
        return null;
    }
  };

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

  return (
    <div className="container max-w-6xl mx-auto pt-4 px-4 sm:px-6 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Hero Draft</h1>
        
        {draftState === 'setup' && (
          <Card className="w-full max-w-4xl mb-8">
            <CardHeader>
              <CardTitle>Select Draft Mode</CardTitle>
              <CardDescription>
                Choose how you want to draft heroes for your game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all-random" className="w-full" onValueChange={(value) => setSelectedMode(value as DraftMode)}>
                <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
                  {Object.keys(modeDescriptions).map((mode) => (
                    <TabsTrigger key={mode} value={mode} className="flex items-center justify-center">
                      {modeIcons[mode as DraftMode]}
                      <span>{mode.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(modeDescriptions).map(([mode, description]) => (
                  <TabsContent key={mode} value={mode} className="mt-6 space-y-4">
                    <p className="text-muted-foreground">{description}</p>
                  </TabsContent>
                ))}
              </Tabs>

              {renderDraftComponent()}

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={startDraft}
                  className="flex items-center"
                >
                  Start Draft
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {draftState !== 'setup' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
          >
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    {selectedMode && modeIcons[selectedMode]}
                    {selectedMode?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={resetDraft}>
                    New Draft
                  </Button>
                </div>
                <CardDescription>
                  {selectedMode && modeDescriptions[selectedMode]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderDraftComponent()}
              </CardContent>
            </Card>

            {draftState === 'completed' && completedDraftData.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Draft Results</CardTitle>
                  <CardDescription>
                    Log this draft as a completed game to update hero statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium mb-3 text-red-600">Red Team</h3>
                      <div className="space-y-2">
                        {completedDraftData
                          .filter(player => player.team === 'Red')
                          .map((player, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-2">
                              <span>{player.name}</span>
                              <span className="font-medium">{player.heroName}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 text-blue-600">Blue Team</h3>
                      <div className="space-y-2">
                        {completedDraftData
                          .filter(player => player.team === 'Blue')
                          .map((player, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-2">
                              <span>{player.name}</span>
                              <span className="font-medium">{player.heroName}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={resetDraft}>
                      Start New Draft
                    </Button>
                    
                    <LogDraftGame 
                      playerData={completedDraftData}
                      onComplete={() => navigate('/game-stats')}
                    />
                  </div>
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
