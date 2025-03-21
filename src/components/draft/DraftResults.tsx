
import React from 'react';
import { Button } from "@/components/ui/button";
import LogDraftGame from './LogDraftGame';
import { useNavigate } from 'react-router-dom';

interface DraftResultsProps {
  completedDraftData: any[];
  onResetDraft: () => void;
}

const DraftResults: React.FC<DraftResultsProps> = ({ 
  completedDraftData, 
  onResetDraft 
}) => {
  const navigate = useNavigate();

  return (
    <div>
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
        <Button variant="outline" onClick={onResetDraft}>
          Start New Draft
        </Button>
        
        <LogDraftGame 
          playerData={completedDraftData}
          onComplete={() => navigate('/game-stats')}
        />
      </div>
    </div>
  );
};

export default DraftResults;
