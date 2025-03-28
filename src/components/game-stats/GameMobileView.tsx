
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
import { useIsMobile } from '@/hooks/use-mobile';

interface GameMobileViewProps {
  players: GamePlayer[];
}

export const GameMobileView: React.FC<GameMobileViewProps> = ({ players }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="rounded-md border w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table className={cn(isMobile && "table-condensed")}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[36%] py-1 px-1 text-left text-xs">Player</TableHead>
              <TableHead className="w-[24%] py-1 px-0 text-center text-xs">Team</TableHead>
              <TableHead className="w-[40%] py-1 px-1 text-left text-xs">Hero</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.playerId}>
                <TableCell className="py-1 px-1 text-xs whitespace-normal break-words">
                  {player.playerName}
                </TableCell>
                <TableCell className="py-1 px-0 text-center">
                  <span className={cn(
                    "px-1 py-0.5 rounded-full text-xs font-medium inline-block",
                    player.team === "Blue" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  )}>
                    {player.team}
                  </span>
                </TableCell>
                <TableCell className="flex items-center gap-1 py-1 px-1">
                  <Avatar className="h-4 w-4 flex-shrink-0">
                    <AvatarImage src={`/heroes/${player.heroName.toLowerCase()}.jpg`} alt={player.heroName} />
                    <AvatarFallback className="text-[10px] bg-amber-100 text-amber-800">{player.heroName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs">{player.heroName}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
