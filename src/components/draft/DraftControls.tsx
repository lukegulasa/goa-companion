
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shuffle } from 'lucide-react';

interface DraftControlsProps {
  draftStage: 'setup' | 'hero-selection' | 'team-draft' | 'complete';
  resetDraft: () => void;
  handleDraftComplete: () => void;
}

const DraftControls: React.FC<DraftControlsProps> = ({ 
  draftStage, 
  resetDraft, 
  handleDraftComplete 
}) => {
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
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Player Draft</h3>
      {draftStage !== 'setup' && (
        <Button 
          onClick={resetDraft} 
          variant="outline" 
          size="sm"
          className="flex items-center"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Reset Draft
        </Button>
      )}
    </div>
  );
};

export default DraftControls;
