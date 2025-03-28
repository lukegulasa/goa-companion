
import React from 'react';
import TeamDisplay from './TeamDisplay';
import PlayerSelector from './PlayerSelector';
import DraftStatusBanner from './DraftStatusBanner';
import { Hero } from '@/lib/types';

interface Player {
  id: number;
  name: string;
  hero: Hero;
  team?: 'A' | 'B';
}

interface TeamDraftSectionProps {
  players: Player[];
  captainA: number | null;
  captainB: number | null;
  currentCaptain: 'A' | 'B';
  selectPlayer: (playerId: number) => void;
}

const TeamDraftSection: React.FC<TeamDraftSectionProps> = ({
  players,
  captainA,
  captainB,
  currentCaptain,
  selectPlayer
}) => {
  return (
    <>
      <DraftStatusBanner currentCaptain={currentCaptain} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamDisplay 
          team="A"
          players={players}
          captainId={captainA}
          teamColor="bg-blue-500"
          teamName="Team A"
        />
        
        <TeamDisplay 
          team="B"
          players={players}
          captainId={captainB}
          teamColor="bg-red-500"
          teamName="Team B"
        />
      </div>
      
      <PlayerSelector 
        players={players}
        onSelectPlayer={selectPlayer}
      />
    </>
  );
};

export default TeamDraftSection;
