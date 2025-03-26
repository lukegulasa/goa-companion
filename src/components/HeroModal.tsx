
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

const HeroModal: React.FC = () => {
  const { selectedHero, isModalOpen, closeModal, heroes } = useGallery();
  const { heroStats, heroMatchups, heroSynergies, gamesLogged } = useHeroStats();

  if (!selectedHero) return null;

  // Get stats for the selected hero
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
          <HeroModalImage heroName={selectedHero.name} />
          
          <HeroModalWinRate 
            heroStat={heroStat} 
            gamesLogged={gamesLogged} 
          />
          
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
