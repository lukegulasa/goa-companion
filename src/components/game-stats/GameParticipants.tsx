
import React from 'react';
import { TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GamePlayer } from '@/lib/game-stats-types';
import { Hero } from '@/lib/types';

interface GameParticipantsProps {
  participants: GamePlayer[];
  players: { id: string; name: string }[];
  heroes: Hero[];
  onAddPlayer: (playerId: string) => void;
  onRemovePlayer: (index: number) => void;
  onUpdateParticipant: (index: number, field: keyof GamePlayer, value: any) => void;
}

export const GameParticipants: React.FC<GameParticipantsProps> = ({
  participants,
  players,
  heroes,
  onAddPlayer,
  onRemovePlayer,
  onUpdateParticipant,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Game Participants</h3>
        <Select onValueChange={onAddPlayer}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add player to game" />
          </SelectTrigger>
          <SelectContent>
            {players.map((player) => (
              <SelectItem 
                key={player.id} 
                value={player.id}
                disabled={participants.some(p => p.playerId === player.id)}
              >
                {player.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {participants.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Hero</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant, index) => (
                <TableRow key={participant.playerId}>
                  <TableCell>{participant.playerName}</TableCell>
                  <TableCell>
                    <Select
                      value={participant.team}
                      onValueChange={(value) => 
                        onUpdateParticipant(index, 'team', value as 'Red' | 'Blue')
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={participant.heroId.toString()}
                      onValueChange={(value) => 
                        onUpdateParticipant(index, 'heroId', Number(value))
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select hero" />
                      </SelectTrigger>
                      <SelectContent>
                        {heroes.map((hero) => (
                          <SelectItem key={hero.id} value={hero.id.toString()}>
                            {hero.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePlayer(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-[100px] items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">
            Add players to the game using the dropdown above
          </p>
        </div>
      )}
    </div>
  );
};
