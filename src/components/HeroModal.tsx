
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGallery } from '@/context/GalleryContext';
import { useHeroStats } from '@/hooks/use-hero-stats';
import { getHeroMatchups, getHeroStats, getHeroSynergies } from '@/lib/hero-stats-utils';
import { HeroModalHeader } from './hero-modal/HeroModalHeader';
import { HeroModalImage } from './hero-modal/HeroModalImage';
import { HeroModalWinRate } from './hero-modal/HeroModalWinRate';
import { HeroModalTags } from './hero-modal/HeroModalTags';
import { HeroModalStats } from './hero-modal/HeroModalStats';
import { HeroModalPerformance } from './hero-modal/HeroModalPerformance';
import { HeroModalAdditionalInfo } from './hero-modal/HeroModalAdditionalInfo';
import { Star } from 'lucide-react';

const HeroModal: React.FC = () => {
  const { selectedHero, isModalOpen, closeModal, heroes } = useGallery();
  const { heroStats, heroMatchups, heroSynergies, gamesLogged } = useHeroStats();

  if (!selectedHero) return null;

  // Get stats for the selected hero from database data
  const heroStat = getHeroStats(selectedHero.id, heroStats);
  const matchups = getHeroMatchups(selectedHero.id, heroMatchups)
    .filter(m => m.gamesPlayed >= 1)
    .sort((a, b) => b.winRate - a.winRate);
  const synergies = getHeroSynergies(selectedHero.id, heroSynergies)
    .filter(s => s.gamesPlayed >= 1)
    .sort((a, b) => b.winRate - a.winRate);

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden glass-panel max-h-[90vh] overflow-y-auto">
        <HeroModalHeader 
          fullName={selectedHero.fullName} 
          stars={selectedHero.stars} 
        />
        
        <div className="p-6 pt-2">
          {/* Hero image and stars layout */}
          <div className="flex items-start mb-6">
            <HeroModalImage heroName={selectedHero.name} />
            
            <div className="ml-4 flex flex-col">
              {/* Display stars */}
              <div className="flex items-center mb-2">
                {Array.from({ length: selectedHero.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    strokeWidth={1}
                  />
                ))}
              </div>
              
              {/* Win rate */}
              {gamesLogged > 0 && (
                <div className="mt-1">
                  <HeroModalWinRate 
                    heroStat={heroStat} 
                    gamesLogged={gamesLogged} 
                  />
                </div>
              )}
            </div>
          </div>
          
          <HeroModalTags tags={selectedHero.allTags} />
          
          <HeroModalStats 
            stats={selectedHero.stats} 
            statTotal={selectedHero.statTotal} 
          />
          
          <HeroModalPerformance 
            matchups={matchups}
            synergies={synergies}
            gamesLogged={gamesLogged}
            heroes={heroes}
          />
          
          <HeroModalAdditionalInfo 
            abilities={selectedHero.abilities}
            playstyle={selectedHero.playstyle}
            synergies={selectedHero.synergies}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeroModal;
