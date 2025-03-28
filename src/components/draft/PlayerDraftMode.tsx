
import React from 'react';
import { useHeroes } from '@/hooks/use-heroes';
import PlayerDraftSetup from './PlayerDraftSetup';
import DraftConfirmDialog from './DraftConfirmDialog';
import TeamDraftSection from './TeamDraftSection';
import DraftControls from './DraftControls';
import { usePlayerDraft } from '@/hooks/use-player-draft';

interface PlayerDraftModeProps {
  playerCount: number;
  playerNames?: string[];
  onComplete: (draftData: any[]) => void;
}

const PlayerDraftMode: React.FC<PlayerDraftModeProps> = ({
  playerCount,
  playerNames = [],
  onComplete
}) => {
  const { heroes } = useHeroes();
  
  const {
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
  } = usePlayerDraft(playerCount, playerNames, heroes);
  
  const handleDraftComplete = () => {
    const draftData = prepareDraftData();
    onComplete(draftData);
  };
  
  return (
    <div className="space-y-6">
      <DraftControls 
        draftStage={draftStage} 
        resetDraft={resetDraft} 
        handleDraftComplete={handleDraftComplete} 
      />
      
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
        <TeamDraftSection
          players={players}
          captainA={captainA}
          captainB={captainB}
          currentCaptain={currentCaptain}
          selectPlayer={selectPlayer}
        />
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
