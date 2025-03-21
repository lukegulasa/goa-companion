
import React from 'react';
import { Button } from "@/components/ui/button";
import LogDraftGame from './LogDraftGame';
import { useNavigate } from 'react-router-dom';

interface DraftActionsProps {
  completedDraftData: any[];
  onResetDraft: () => void;
}

const DraftActions: React.FC<DraftActionsProps> = ({ 
  completedDraftData, 
  onResetDraft 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onResetDraft}>
        Start New Draft
      </Button>
      
      <LogDraftGame 
        playerData={completedDraftData}
        onComplete={() => navigate('/game-stats')}
      />
    </div>
  );
};

export default DraftActions;
