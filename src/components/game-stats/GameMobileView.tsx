
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
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[34%] py-2 px-1 text-left">Player</TableHead>
              <TableHead className="w-[26%] py-2 px-1 text-center">Team</TableHead>
              <TableHead className="w-[40%] py-2 px-1 text-left">Hero</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.playerId}>
                <TableCell className="py-2 px-1 whitespace-normal break-words">{player.playerName}</TableCell>
                <TableCell className="py-2 px-1 text-center">
                  <span className={cn(
                    "px-1 py-0.5 rounded-full text-xs font-medium inline-block",
                    player.team === "Blue" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  )}>
                    {player.team}
                  </span>
                </TableCell>
                <TableCell className="flex items-center gap-1 py-2 px-1">
                  <Avatar className="h-5 w-5 flex-shrink-0">
                    <AvatarImage src={`/heroes/${player.heroName.toLowerCase()}.jpg`} alt={player.heroName} />
                    <AvatarFallback className="text-xs bg-amber-100 text-amber-800">{player.heroName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs sm:text-sm">{player.heroName}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
