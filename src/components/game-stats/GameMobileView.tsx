
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GamePlayer } from '@/lib/game-stats-types';

interface GameMobileViewProps {
  players: GamePlayer[];
}

export const GameMobileView: React.FC<GameMobileViewProps> = ({ players }) => {
  return (
    <div className="rounded-md border w-full overflow-hidden">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[33%]">Player</TableHead>
              <TableHead className="w-[25%]">Team</TableHead>
              <TableHead className="w-[42%]">Hero</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.playerId}>
                <TableCell className="py-3 whitespace-normal break-words">{player.playerName}</TableCell>
                <TableCell className="py-3">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    player.team === "Blue" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  )}>
                    {player.team}
                  </span>
                </TableCell>
                <TableCell className="flex items-center gap-2 py-3">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={`/heroes/${player.heroName.toLowerCase()}.jpg`} alt={player.heroName} />
                    <AvatarFallback className="text-xs bg-amber-100 text-amber-800">{player.heroName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{player.heroName}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
