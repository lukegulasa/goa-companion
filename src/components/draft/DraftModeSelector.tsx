
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shuffle, 
  List, 
  ListTree, 
  Dice5, 
  Users, 
  Check, 
  Ban,
} from 'lucide-react';
import { DraftMode } from '@/pages/DraftPage';
import { useIsMobile } from '@/hooks/use-mobile';

interface DraftModeSelectorProps {
  selectedMode: DraftMode;
  onModeChange: (mode: DraftMode) => void;
}

const DraftModeSelector: React.FC<DraftModeSelectorProps> = ({ 
  selectedMode, 
  onModeChange 
}) => {
  const isMobile = useIsMobile();
  
  const modeDescriptions = {
    'all-random': 'Randomly select heroes for each player.',
    'all-pick': 'Players pick a hero to play out of all available heroes (starting with the team showing on the Tie breaker coin and alternating between teams).',
    'single-draft': 'Give each player 3 heroes randomly. Players take turns to pick a hero to play out of those dealt to them.',
    'random-draft': 'Randomly select a number of heroes equal to the number of players plus 2. Players pick a hero to play out of the selected heroes.',
    'player-draft': 'Select two of the most experienced players as captains for each team. Using any of the above methods, select a hero for each player.',
    'pick-ban': 'Each team collectively chooses a hero to pick or ban. The team showing on the Tie Breaker coin is "Team A" the other team is "Team B".'
  };

  const modeIcons = {
    'all-random': <Shuffle className="w-5 h-5 mr-2" />,
    'all-pick': <List className="w-5 h-5 mr-2" />,
    'single-draft': <ListTree className="w-5 h-5 mr-2" />,
    'random-draft': <Dice5 className="w-5 h-5 mr-2" />,
    'player-draft': <Users className="w-5 h-5 mr-2" />,
    'pick-ban': <div className="flex mr-2"><Check className="w-5 h-5" /><Ban className="w-5 h-5" /></div>,
  };

  return (
    <Tabs defaultValue="all-random" className="w-full" onValueChange={(value) => onModeChange(value as DraftMode)}>
      <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-2 md:grid-cols-3'} w-full`}>
        {Object.keys(modeDescriptions).map((mode) => (
          <TabsTrigger 
            key={mode} 
            value={mode} 
            className={`flex items-center justify-center ${isMobile ? 'text-xs py-1.5 px-1' : ''}`}
          >
            {modeIcons[mode as DraftMode]}
            <span>{mode.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(modeDescriptions).map(([mode, description]) => (
        <TabsContent key={mode} value={mode} className={`${isMobile ? 'mt-4' : 'mt-6'} space-y-4`}>
          <p className="text-muted-foreground text-sm">{description}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DraftModeSelector;
