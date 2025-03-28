
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
    <div className="w-full">
      <Tabs defaultValue="all-random" className="w-full" onValueChange={(value) => onModeChange(value as DraftMode)}>
        {/* Updated TabsList with better spacing for desktop and mobile */}
        <TabsList className={`${isMobile ? 'flex flex-col space-y-1' : 'grid grid-cols-3 gap-1'} w-full`}>
          {Object.keys(modeDescriptions).map((mode) => (
            <TabsTrigger 
              key={mode} 
              value={mode} 
              className="flex items-center justify-start px-3 py-2 h-auto"
            >
              {modeIcons[mode as DraftMode]}
              <span className="whitespace-nowrap">{mode.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Added more vertical spacing between the tabs and content */}
        <div className="mt-8 pt-2">
          {Object.entries(modeDescriptions).map(([mode, description]) => (
            <TabsContent key={mode} value={mode} className="space-y-4">
              <p className="text-muted-foreground text-sm">{description}</p>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default DraftModeSelector;
