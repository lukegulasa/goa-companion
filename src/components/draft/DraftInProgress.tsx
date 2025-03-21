
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DraftMode } from '@/pages/DraftPage';
import AllRandomDraft from './AllRandomDraft';
import AllPickDraft from './AllPickDraft';
import SingleDraftMode from './SingleDraftMode';
import RandomDraftMode from './RandomDraftMode';
import PlayerDraftMode from './PlayerDraftMode';
import PickBanDraftMode from './PickBanDraftMode';
import DraftResults from './DraftResults';
import { Button } from "@/components/ui/button";

interface DraftInProgressProps {
  selectedMode: DraftMode;
  playerCount: number;
  playerNames: string[];
  draftState: 'in-progress' | 'completed';
  completedDraftData: any[];
  onDraftComplete: (draftData: any[]) => void;
  onResetDraft: () => void;
  modeDescriptions: Record<DraftMode, string>;
  modeIcons: Record<DraftMode, JSX.Element>;
}

const DraftInProgress: React.FC<DraftInProgressProps> = ({
  selectedMode,
  playerCount,
  playerNames,
  draftState,
  completedDraftData,
  onDraftComplete,
  onResetDraft,
  modeDescriptions,
  modeIcons
}) => {
  const renderDraftComponent = () => {
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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            {selectedMode && modeIcons[selectedMode]}
            {selectedMode?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onResetDraft}>
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
  );
};

export default DraftInProgress;
