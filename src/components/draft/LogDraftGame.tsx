
import React, { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Database } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GamePlayer } from '@/lib/game-stats-types';
import { useCloudSync } from '@/hooks/cloud-sync';
import { useAuth } from '@/context/AuthContext';

interface LogDraftGameProps {
  playerData: {
    id: string;
    name: string;
    team: 'Red' | 'Blue';
    heroId: number;
    heroName: string;
  }[];
  onComplete: () => void;
}

const LogDraftGame: React.FC<LogDraftGameProps> = ({ playerData, onComplete }) => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [winningTeam, setWinningTeam] = useState<'Red' | 'Blue'>('Red');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Use cloud sync for games
  const { data: games, setData: setGames } = useCloudSync<'games'>('games');
  
  const handleConfirm = () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admins can log games",
        variant: "destructive"
      });
      return;
    }
    
    // Create game players data
    const gamePlayers: GamePlayer[] = playerData.map(player => ({
      playerId: player.id,
      playerName: player.name,
      team: player.team,
      heroId: player.heroId,
      heroName: player.heroName
    }));
    
    // Create new game entry
    const newGame = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      players: gamePlayers,
      winningTeam: winningTeam
    };
    
    // Save to cloud
    setGames([...games, newGame]);
    
    toast({
      title: "Game Logged",
      description: "The draft has been successfully logged as a game."
    });
    
    setDialogOpen(false);
    onComplete();
  };
  
  return (
    <div>
      <div className="space-y-4 mb-4">
        <div>
          <Label htmlFor="winning-team">Winning Team</Label>
          <Select
            value={winningTeam}
            onValueChange={(value) => setWinningTeam(value as 'Red' | 'Blue')}
            disabled={!isAdmin}
          >
            <SelectTrigger id="winning-team" className="w-full mt-1">
              <SelectValue placeholder="Select winning team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Red">Red Team</SelectItem>
              <SelectItem value="Blue">Blue Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            className="flex items-center" 
            onClick={() => setDialogOpen(true)}
            disabled={!isAdmin}
          >
            <Trophy className="mr-2 h-4 w-4" />
            {isAdmin ? 'Log Draft as Game' : 'Admin Only: Log Draft as Game'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log Draft as Game</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new game entry with {playerData.length} players and record {winningTeam} team as the winner.
              All hero win rates and statistics will be updated accordingly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              <Database className="mr-2 h-4 w-4" />
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LogDraftGame;
