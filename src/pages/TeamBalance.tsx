
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Player, Game } from '@/lib/game-stats-types';
import { getPlayerStats, findBalancedTeams, PlayerWithStats, TeamConfig } from '@/lib/team-balance-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, RefreshCw, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PlayerStrengthTable from '@/components/team-balance/PlayerStrengthTable';
import TeamDisplay from '@/components/team-balance/TeamDisplay';

const TeamBalance: React.FC = () => {
  const [players] = useLocalStorage<Player[]>('game-players', []);
  const [games] = useLocalStorage<Game[]>('game-logs', []);
  const [playerStats, setPlayerStats] = useState<PlayerWithStats[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState<'2v2' | '3v3'>('2v2');
  const [balancedTeams, setBalancedTeams] = useState<TeamConfig | null>(null);

  useEffect(() => {
    if (players.length > 0 && games.length > 0) {
      const stats = getPlayerStats(players, games);
      setPlayerStats(stats);
    }
  }, [players, games]);

  const handlePlayerSelection = (playerId: string) => {
    setSelectedPlayerIds(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        // Limit selection based on team size
        const requiredPlayers = teamSize === '2v2' ? 4 : 6;
        if (prev.length < requiredPlayers) {
          return [...prev, playerId];
        }
        return prev;
      }
    });
    
    // Reset balanced teams when selection changes
    setBalancedTeams(null);
  };

  const handleTeamSizeChange = (size: '2v2' | '3v3') => {
    setTeamSize(size);
    setSelectedPlayerIds([]);
    setBalancedTeams(null);
  };

  const calculateBalancedTeams = () => {
    const requiredPlayers = teamSize === '2v2' ? 4 : 6;
    
    if (selectedPlayerIds.length !== requiredPlayers) {
      return;
    }
    
    const selectedPlayers = playerStats.filter(player => 
      selectedPlayerIds.includes(player.id)
    );
    
    const balancedConfig = findBalancedTeams(selectedPlayers);
    setBalancedTeams(balancedConfig);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Team Balance</h1>
        <p className="text-muted-foreground mt-1">Create balanced teams based on player stats</p>
      </header>
      
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList>
          <TabsTrigger value="setup">Team Setup</TabsTrigger>
          <TabsTrigger value="results" disabled={!balancedTeams}>Team Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="space-y-6">
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
              <div>
                <Label className="text-base">Match Format</Label>
                <RadioGroup 
                  value={teamSize} 
                  onValueChange={(v) => handleTeamSizeChange(v as '2v2' | '3v3')} 
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2v2" id="format-2v2" />
                    <Label htmlFor="format-2v2">2v2 (4 players)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3v3" id="format-3v3" />
                    <Label htmlFor="format-3v3">3v3 (6 players)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-base mb-2 block">Select Players</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select {teamSize === '2v2' ? '4' : '6'} players to create balanced teams
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {playerStats.map(player => (
                    <div 
                      key={player.id}
                      className={`p-3 border rounded-md flex items-center ${
                        selectedPlayerIds.includes(player.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <Checkbox 
                        id={`player-${player.id}`}
                        checked={selectedPlayerIds.includes(player.id)}
                        onCheckedChange={() => handlePlayerSelection(player.id)}
                      />
                      <Label 
                        htmlFor={`player-${player.id}`}
                        className="flex-1 ml-3 cursor-pointer"
                      >
                        {player.name}
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(player.weightedStrength * 100) / 100}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={calculateBalancedTeams}
                  disabled={selectedPlayerIds.length !== (teamSize === '2v2' ? 4 : 6)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Balance Teams
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <PlayerStrengthTable playerStats={playerStats} />
        </TabsContent>
        
        <TabsContent value="results">
          {balancedTeams && (
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
                <Button onClick={() => setBalancedTeams(null)} variant="outline">
                  Reconfigure Teams
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamBalance;
