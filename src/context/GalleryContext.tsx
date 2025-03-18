
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { heroes, getAllTags } from '@/lib/data';
import { GalleryContextType, Hero, SortOption } from '@/lib/types';

// Create the context
const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

// Create a provider component
export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [starFilters, setStarFilters] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('nameAsc');

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
      default:
        break;
    }

    return filtered;
  }, [heroes, tagFilters, starFilters, sortOption]);

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
