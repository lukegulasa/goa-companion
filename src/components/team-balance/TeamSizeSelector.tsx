
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface TeamSizeSelectorProps {
  teamSize: '2v2' | '3v3';
  onChange: (size: '2v2' | '3v3') => void;
}

const TeamSizeSelector: React.FC<TeamSizeSelectorProps> = ({ teamSize, onChange }) => {
  return (
    <div>
      <Label className="text-base">Match Format</Label>
      <RadioGroup 
        value={teamSize} 
        onValueChange={(v) => onChange(v as '2v2' | '3v3')} 
        className="flex space-x-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2v2" id="format-2v2" />
          <Label htmlFor="format-2v2">2v2 (4 players)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3v3" id="format-3v3" />
          <Label htmlFor="format-3v3">3v3 (6 players)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TeamSizeSelector;
