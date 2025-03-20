
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface PickBanDraftModeProps {
  playerCount: number;
  onComplete: () => void;
}

const PickBanDraftMode: React.FC<PickBanDraftModeProps> = ({ playerCount, onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
      <p className="text-muted-foreground text-center mb-6">
        The Pick and Ban mode is under development and will be available soon.
      </p>
      <Button onClick={onComplete}>
        Back to Draft Selection
      </Button>
    </div>
  );
};

export default PickBanDraftMode;
