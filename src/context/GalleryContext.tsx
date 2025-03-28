import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { heroes, getAllTags } from '@/lib/data';
import { GalleryContextType, Hero, SortOption } from '@/lib/types';
import { useHeroStats } from '@/hooks/use-hero-stats';

// Create the context
const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

// Create a provider component
export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [starFilters, setStarFilters] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('nameAsc');
  const { heroStats } = useHeroStats();

  // Apply filters and sorting
  const filteredHeroes = useMemo(() => {
    let filtered = [...heroes];

    // Apply tag filters
    if (tagFilters.length > 0) {
      filtered = filtered.filter(hero => 
        tagFilters.every(tag => hero.allTags.includes(tag))
      );
    }

    // Apply star filters
    if (starFilters.length > 0) {
      filtered = filtered.filter(hero => 
        starFilters.includes(hero.stars)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'starsAsc':
        filtered.sort((a, b) => a.stars - b.stars);
        break;
      case 'starsDesc':
        filtered.sort((a, b) => b.stars - a.stars);
        break;
      case 'statTotalAsc':
        filtered.sort((a, b) => {
          const totalA = a.statTotal.boosted || a.statTotal.base;
          const totalB = b.statTotal.boosted || b.statTotal.base;
          return totalA - totalB;
        });
        break;
      case 'statTotalDesc':
        filtered.sort((a, b) => {
          const totalA = a.statTotal.boosted || a.statTotal.base;
          const totalB = b.statTotal.boosted || b.statTotal.base;
          return totalB - totalA;
        });
        break;
      case 'winRateAsc':
        filtered.sort((a, b) => {
          const statsA = heroStats.find(stats => stats.heroId === a.id);
          const statsB = heroStats.find(stats => stats.heroId === b.id);
          const winRateA = statsA ? statsA.winRate : 0;
          const winRateB = statsB ? statsB.winRate : 0;
          return winRateA - winRateB;
        });
        break;
      case 'winRateDesc':
        filtered.sort((a, b) => {
          const statsA = heroStats.find(stats => stats.heroId === a.id);
          const statsB = heroStats.find(stats => stats.heroId === b.id);
          const winRateA = statsA ? statsA.winRate : 0;
          const winRateB = statsB ? statsB.winRate : 0;
          return winRateB - winRateA;
        });
        break;
      case 'attackAsc':
        filtered.sort((a, b) => {
          const statA = a.stats.attack.boosted || a.stats.attack.base;
          const statB = b.stats.attack.boosted || b.stats.attack.base;
          return statA - statB;
        });
        break;
      case 'attackDesc':
        filtered.sort((a, b) => {
          const statA = a.stats.attack.boosted || a.stats.attack.base;
          const statB = b.stats.attack.boosted || b.stats.attack.base;
          return statB - statA;
        });
        break;
      case 'initiativeAsc':
        filtered.sort((a, b) => {
          const statA = a.stats.initiative.boosted || a.stats.initiative.base;
          const statB = b.stats.initiative.boosted || b.stats.initiative.base;
          return statA - statB;
        });
        break;
      case 'initiativeDesc':
        filtered.sort((a, b) => {
          const statA = a.stats.initiative.boosted || a.stats.initiative.base;
          const statB = b.stats.initiative.boosted || b.stats.initiative.base;
          return statB - statA;
        });
        break;
      case 'defenseAsc':
        filtered.sort((a, b) => {
          const statA = a.stats.defense.boosted || a.stats.defense.base;
          const statB = b.stats.defense.boosted || b.stats.defense.base;
          return statA - statB;
        });
        break;
      case 'defenseDesc':
        filtered.sort((a, b) => {
          const statA = a.stats.defense.boosted || a.stats.defense.base;
          const statB = b.stats.defense.boosted || b.stats.defense.base;
          return statB - statA;
        });
        break;
      case 'movementAsc':
        filtered.sort((a, b) => {
          const statA = a.stats.movement.boosted || a.stats.movement.base;
          const statB = b.stats.movement.boosted || b.stats.movement.base;
          return statA - statB;
        });
        break;
      case 'movementDesc':
        filtered.sort((a, b) => {
          const statA = a.stats.movement.boosted || a.stats.movement.base;
          const statB = b.stats.movement.boosted || b.stats.movement.base;
          return statB - statA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [heroes, tagFilters, starFilters, sortOption, heroStats]);

  // Select a hero and open the modal
  const selectHero = (hero: Hero) => {
    setSelectedHero(hero);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Toggle a tag filter
  const toggleTagFilter = (tag: string) => {
    setTagFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Toggle a star filter
  const toggleStarFilter = (star: number) => {
    setStarFilters(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star) 
        : [...prev, star]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setTagFilters([]);
    setStarFilters([]);
    setSortOption('nameAsc');
  };

  // Context value
  const value: GalleryContextType = {
    heroes,
    filteredHeroes,
    selectedHero,
    isModalOpen,
    tagFilters,
    starFilters,
    sortOption,
    selectHero,
    closeModal,
    toggleTagFilter,
    toggleStarFilter,
    setSortOption,
    clearFilters
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

// Create a hook to use the gallery context
export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
