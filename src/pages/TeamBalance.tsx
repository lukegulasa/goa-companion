
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Player, Game } from '@/lib/game-stats-types';
import { getPlayerStats, findBalancedTeams, PlayerWithStats, TeamConfig } from '@/lib/team-balance-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import TeamBalanceSetup from '@/components/team-balance/TeamBalanceSetup';
import TeamBalanceResults from '@/components/team-balance/TeamBalanceResults';

const TeamBalance: React.FC = () => {
  const [players] = useLocalStorage<Player[]>('game-players', []);
  const [games] = useLocalStorage<Game[]>('game-logs', []);
  const [playerStats, setPlayerStats] = useState<PlayerWithStats[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState<'2v2' | '3v3'>('2v2');
  const [balancedTeams, setBalancedTeams] = useState<TeamConfig | null>(null);
  const [activeTab, setActiveTab] = useState<string>('setup');
  const { toast } = useToast();

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
      toast({
        title: "Incorrect number of players",
        description: `Please select exactly ${requiredPlayers} players for ${teamSize} format.`,
        variant: "destructive"
      });
      return;
    }
    
    const selectedPlayers = playerStats.filter(player => 
      selectedPlayerIds.includes(player.id)
    );
    
    try {
      const balancedConfig = findBalancedTeams(selectedPlayers);
      setBalancedTeams(balancedConfig);
      setActiveTab('results');
    } catch (error) {
      console.error("Error balancing teams:", error);
      toast({
        title: "Error creating teams",
        description: "There was a problem balancing the teams. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReconfigure = () => {
    setActiveTab('setup');
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Team Balance</h1>
        <p className="text-muted-foreground mt-1">Create balanced teams based on player stats</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="setup">Team Setup</TabsTrigger>
          <TabsTrigger value="results" disabled={!balancedTeams}>Team Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <TeamBalanceSetup 
            playerStats={playerStats}
            selectedPlayerIds={selectedPlayerIds}
            teamSize={teamSize}
            onPlayerSelect={handlePlayerSelection}
            onTeamSizeChange={handleTeamSizeChange}
            onBalanceTeams={calculateBalancedTeams}
          />
        </TabsContent>
        
        <TabsContent value="results">
          {balancedTeams && (
            <TeamBalanceResults 
              balancedTeams={balancedTeams}
              onReconfigure={handleReconfigure}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamBalance;
