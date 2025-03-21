
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Player } from '@/lib/game-stats-types';

interface DraftPlayerSelectProps {
  playerCount: number;
  selectedPlayers: string[];
  onSelectPlayer: (index: number, playerId: string) => void;
  playerNames: string[];
  setPlayerNames: (names: string[]) => void;
}

const DraftPlayerSelect: React.FC<DraftPlayerSelectProps> = ({
  playerCount,
  selectedPlayers,
  onSelectPlayer,
  playerNames,
  setPlayerNames,
}) => {
  const [savedPlayers] = useLocalStorage<Player[]>('game-players', []);
  
  const handlePlayerSelect = (index: number, playerId: string) => {
    onSelectPlayer(index, playerId);
    
    // Update player name if a saved player is selected
    if (playerId) {
      const player = savedPlayers.find(p => p.id === playerId);
      if (player) {
        const newNames = [...playerNames];
        newNames[index] = player.name;
        setPlayerNames(newNames);
      }
    }
  };
  
  return (
    <div>
      <h4 className="text-md font-medium mb-2 flex items-center">
        <User className="mr-2 h-4 w-4" />
        Select Players
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {Array.from({ length: playerCount }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`player-select-${index}`}>Player {index + 1}</Label>
            <Select
              value={selectedPlayers[index] || ""}
              onValueChange={(value) => handlePlayerSelect(index, value)}
            >
              <SelectTrigger id={`player-select-${index}`}>
                <SelectValue placeholder="Select a player" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Custom Name</SelectItem>
                {savedPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftPlayerSelect;
