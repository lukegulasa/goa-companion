
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Shuffle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlayerDraftSetupProps {
  draftMethod: 'all-random' | 'all-pick';
  setDraftMethod: (method: 'all-random' | 'all-pick') => void;
  playerCount: number;
  playerNamesState: string[];
  handlePlayerNameChange: (index: number, name: string) => void;
  captainA: number | null;
  setCaptainA: (index: number | null) => void;
  captainB: number | null;
  setCaptainB: (index: number | null) => void;
  setupDraft: () => void;
}

const PlayerDraftSetup: React.FC<PlayerDraftSetupProps> = ({
  draftMethod,
  setDraftMethod,
  playerCount,
  playerNamesState,
  handlePlayerNameChange,
  captainA,
  setCaptainA,
  captainB,
  setCaptainB,
  setupDraft
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="draft-method">Hero Selection Method</Label>
        <Select 
          value={draftMethod} 
          onValueChange={(value) => setDraftMethod(value as 'all-random' | 'all-pick')}
        >
          <SelectTrigger id="draft-method" className="w-full mt-1">
            <SelectValue placeholder="Select a draft method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-random">All Random</SelectItem>
            <SelectItem value="all-pick">All Pick (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          This determines how heroes are assigned to players before team drafting begins.
        </p>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2 flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Player Names
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: playerCount }).map((_, index) => (
            <div key={index}>
              <Label htmlFor={`player-${index}`}>Player {index + 1}</Label>
              <Input
                id={`player-${index}`}
                value={playerNamesState[index]}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="captain-a">Team A Captain</Label>
          <Select 
            value={captainA !== null ? captainA.toString() : undefined} 
            onValueChange={(value) => setCaptainA(parseInt(value))}
          >
            <SelectTrigger id="captain-a" className="w-full mt-1">
              <SelectValue placeholder="Select Team A Captain" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: playerCount }).map((_, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {playerNamesState[index] || `Player ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="captain-b">Team B Captain</Label>
          <Select 
            value={captainB !== null ? captainB.toString() : undefined}
            onValueChange={(value) => setCaptainB(parseInt(value))}
          >
            <SelectTrigger id="captain-b" className="w-full mt-1">
              <SelectValue placeholder="Select Team B Captain" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: playerCount }).map((_, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {playerNamesState[index] || `Player ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={setupDraft}>
          Continue to Hero Assignment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerDraftSetup;
