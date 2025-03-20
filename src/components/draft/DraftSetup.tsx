
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Users } from 'lucide-react';

interface DraftSetupProps {
  playerCount: number;
  setPlayerCount: (count: number) => void;
}

const DraftSetup: React.FC<DraftSetupProps> = ({ playerCount, setPlayerCount }) => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-3">
              <Users className="mr-2 h-5 w-5" />
              <h3 className="text-lg font-medium">Player Count</h3>
            </div>
            
            <RadioGroup 
              defaultValue={playerCount.toString()} 
              onValueChange={(value) => setPlayerCount(parseInt(value))}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="players-2" />
                <Label htmlFor="players-2">2 Players (1v1)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="players-4" />
                <Label htmlFor="players-4">4 Players (2v2)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="players-6" />
                <Label htmlFor="players-6">6 Players (3v3)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftSetup;
