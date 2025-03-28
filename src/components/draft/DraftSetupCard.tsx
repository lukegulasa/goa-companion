
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import DraftSetup from './DraftSetup';
import DraftPlayerSelect from './DraftPlayerSelect';
import DraftModeSelector from './DraftModeSelector';
import { DraftMode } from '@/pages/DraftPage';

interface DraftSetupCardProps {
  selectedMode: DraftMode;
  setSelectedMode: (mode: DraftMode) => void;
  playerCount: number;
  setPlayerCount: (count: number) => void;
  playerNames: string[];
  selectedPlayers: string[];
  onSelectPlayer: (index: number, playerId: string) => void;
  handlePlayerNameChange: (index: number, name: string) => void;
  startDraft: () => void;
}

const DraftSetupCard: React.FC<DraftSetupCardProps> = ({
  selectedMode,
  setSelectedMode,
  playerCount,
  setPlayerCount,
  playerNames,
  selectedPlayers,
  onSelectPlayer,
  handlePlayerNameChange,
  startDraft
}) => {
  return (
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader className="pb-6">
        <CardTitle>Select Draft Mode</CardTitle>
        <CardDescription>
          Choose how you want to draft heroes for your game
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="pb-4">
          <DraftModeSelector 
            selectedMode={selectedMode} 
            onModeChange={setSelectedMode} 
          />
        </div>

        <DraftSetup 
          playerCount={playerCount} 
          setPlayerCount={setPlayerCount} 
        />
        
        <DraftPlayerSelect
          playerCount={playerCount}
          selectedPlayers={selectedPlayers}
          onSelectPlayer={onSelectPlayer}
          playerNames={playerNames}
          setPlayerNames={handlePlayerNameChange}
        />

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
  );
};

export default DraftSetupCard;
