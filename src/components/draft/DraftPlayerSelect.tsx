
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
import { Player } from '@/lib/game-stats-types';
import { useEffect, useState } from 'react';
import { getPlayers } from '@/lib/db';

interface DraftPlayerSelectProps {
  playerCount: number;
  selectedPlayers: string[];
  onSelectPlayer: (index: number, playerId: string) => void;
  playerNames: string[];
  setPlayerNames: (index: number, name: string) => void;
}

const DraftPlayerSelect: React.FC<DraftPlayerSelectProps> = ({
  playerCount,
  selectedPlayers,
  onSelectPlayer,
  playerNames,
  setPlayerNames,
}) => {
  const [dbPlayers, setDbPlayers] = useState<Player[]>([]);
  
  // Fetch players from the database
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const players = await getPlayers();
        setDbPlayers(players);
      } catch (error) {
        console.error("Error loading players from database:", error);
      }
    };
    
    loadPlayers();
  }, []);
  
  const handlePlayerSelect = (index: number, playerId: string) => {
    onSelectPlayer(index, playerId);
    
    // Update player name if a saved player is selected
    if (playerId && playerId !== 'custom') {
      const player = dbPlayers.find(p => p.id === playerId);
      if (player) {
        setPlayerNames(index, player.name);
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
                <SelectItem value="custom">Custom Name</SelectItem>
                {dbPlayers.map((player) => (
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
