
import { useContext } from 'react';
import { GalleryContext } from '@/context/GalleryContext';
import { Hero } from '@/lib/types';

export function useHeroes() {
  const galleryContext = useContext(GalleryContext);
  
  if (!galleryContext) {
    throw new Error("useHeroes must be used within a GalleryProvider");
  }
  
  return {
    heroes: galleryContext.heroes || []
  };
}
