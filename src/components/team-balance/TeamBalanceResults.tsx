
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TeamDisplay from '@/components/team-balance/TeamDisplay';
import { TeamConfig } from '@/lib/team-balance-utils';

interface TeamBalanceResultsProps {
  balancedTeams: TeamConfig;
  onReconfigure: () => void;
}

const TeamBalanceResults: React.FC<TeamBalanceResultsProps> = ({ 
  balancedTeams, 
  onReconfigure 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balanced Teams</CardTitle>
          <CardDescription>
            Teams balanced with a strength difference of {Math.round(balancedTeams.strengthDifference * 100) / 100}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamDisplay 
              team="A"
              players={balancedTeams.teamA}
              teamStrength={balancedTeams.teamAStrength}
            />
            <TeamDisplay 
              team="B"
              players={balancedTeams.teamB}
              teamStrength={balancedTeams.teamBStrength}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={onReconfigure} variant="outline">
          Reconfigure Teams
        </Button>
      </div>
    </div>
  );
};

export default TeamBalanceResults;
