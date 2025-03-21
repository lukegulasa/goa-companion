
import React from 'react';
import TeamRoster from './TeamRoster';
import DraftActions from './DraftActions';

interface DraftResultsProps {
  completedDraftData: any[];
  onResetDraft: () => void;
}

const DraftResults: React.FC<DraftResultsProps> = ({ 
  completedDraftData, 
  onResetDraft 
}) => {
  const redTeamPlayers = completedDraftData.filter(player => player.team === 'Red');
  const blueTeamPlayers = completedDraftData.filter(player => player.team === 'Blue');

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TeamRoster 
          teamName="Red Team" 
          teamColor="text-red-600" 
          players={redTeamPlayers} 
        />
        <TeamRoster 
          teamName="Blue Team" 
          teamColor="text-blue-600" 
          players={blueTeamPlayers} 
        />
      </div>
      
      <DraftActions
        completedDraftData={completedDraftData}
        onResetDraft={onResetDraft}
      />
    </div>
  );
};

export default DraftResults;
