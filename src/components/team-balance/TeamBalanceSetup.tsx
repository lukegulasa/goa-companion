
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Users } from 'lucide-react';
import { PlayerWithStats } from '@/lib/team-balance-utils';
import PlayerSelector from './PlayerSelector';
import TeamSizeSelector from './TeamSizeSelector';
import PlayerStrengthTable from './PlayerStrengthTable';

interface TeamBalanceSetupProps {
  playerStats: PlayerWithStats[];
  selectedPlayerIds: string[];
  teamSize: '2v2' | '3v3';
  onPlayerSelect: (playerId: string) => void;
  onTeamSizeChange: (size: '2v2' | '3v3') => void;
  onBalanceTeams: () => void;
}

const TeamBalanceSetup: React.FC<TeamBalanceSetupProps> = ({
  playerStats,
  selectedPlayerIds,
  teamSize,
  onPlayerSelect,
  onTeamSizeChange,
  onBalanceTeams,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Team Configuration
          </CardTitle>
          <CardDescription>
            Select your match format and choose players
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TeamSizeSelector 
            teamSize={teamSize} 
            onChange={onTeamSizeChange} 
          />
          
          <PlayerSelector
            playerStats={playerStats}
            selectedPlayerIds={selectedPlayerIds}
            teamSize={teamSize}
            onPlayerSelect={onPlayerSelect}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={onBalanceTeams}
              disabled={selectedPlayerIds.length !== (teamSize === '2v2' ? 4 : 6)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Balance Teams
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <PlayerStrengthTable playerStats={playerStats} />
    </div>
  );
};

export default TeamBalanceSetup;
