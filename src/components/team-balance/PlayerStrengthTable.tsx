
import React from 'react';
import { PlayerWithStats } from '@/lib/team-balance-utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

interface PlayerStrengthTableProps {
  playerStats: PlayerWithStats[];
}

const PlayerStrengthTable: React.FC<PlayerStrengthTableProps> = ({ playerStats }) => {
  // Sort players by weightedStrength (descending)
  const sortedPlayers = [...playerStats].sort((a, b) => b.weightedStrength - a.weightedStrength);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <List className="mr-2 h-5 w-5" />
          Player Strength Ranking
        </CardTitle>
        <CardDescription>
          Players ranked by weighted strength (win rate × experience)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Games</TableHead>
              <TableHead className="text-right">Win Rate</TableHead>
              <TableHead className="text-right">Weighted Strength</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map(player => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell className="text-right">{player.gamesPlayed}</TableCell>
                <TableCell className="text-right">{Math.round(player.winRate * 100)}%</TableCell>
                <TableCell className="text-right">
                  {Math.round(player.weightedStrength * 100) / 100}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlayerStrengthTable;
