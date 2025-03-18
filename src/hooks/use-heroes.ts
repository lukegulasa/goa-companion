
import { useContext } from 'react';
import { useGallery } from '@/context/GalleryContext';
import { Hero } from '@/lib/types';

export function useHeroes() {
  const { heroes } = useGallery();
  
  return {
    heroes: heroes || []
  };
}
