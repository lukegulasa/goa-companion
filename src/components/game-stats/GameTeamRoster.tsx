
import React from 'react';
import { TrophyIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GamePlayer } from '@/lib/game-stats-types';

interface GameTeamRosterProps {
  teamPlayers: GamePlayer[];
  teamName: 'Red' | 'Blue';
  winningTeam: 'Red' | 'Blue';
}

export const GameTeamRoster: React.FC<GameTeamRosterProps> = ({
  teamPlayers,
  teamName,
  winningTeam
}) => {
  const teamColorClass = teamName === 'Blue' 
    ? "bg-blue-50/50 dark:bg-blue-950/20" 
    : "bg-red-50/50 dark:bg-red-950/20";
  
  const headerColorClass = teamName === 'Blue'
    ? "bg-blue-100 dark:bg-blue-900/30 border-b text-blue-800 dark:text-blue-300"
    : "bg-red-100 dark:bg-red-900/30 border-b text-red-800 dark:text-red-300";
  
  const borderColorClass = teamName === 'Blue'
    ? "border border-blue-200 dark:border-blue-800"
    : "border border-red-200 dark:border-red-800";

  return (
    <div className={`rounded-md border ${teamColorClass}`}>
      <div className={`py-2 px-4 ${headerColorClass}`}>
        <h4 className="font-medium">{teamName} Team</h4>
      </div>
      <div className="p-3">
        {teamPlayers.length > 0 ? (
          <ul className="divide-y">
            {teamPlayers.map((player) => (
              <li key={player.playerId} className="py-2 flex items-center">
                <div className="mr-3">
                  <Avatar className={`h-8 w-8 ${borderColorClass}`}>
                    <AvatarImage src={`/heroes/${player.heroName.toLowerCase()}.jpg`} alt={player.heroName} />
                    <AvatarFallback className={teamName === 'Blue' 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }>
                      {player.heroName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="font-medium">{player.playerName}</div>
                  <div className="text-sm text-muted-foreground">{player.heroName}</div>
                </div>
                {winningTeam === teamName && (
                  <TrophyIcon className="h-4 w-4 ml-auto text-yellow-500" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground p-2">No players on {teamName} Team</p>
        )}
      </div>
    </div>
  );
};
