
export interface Stat {
  base: number;
  boosted?: number;
}

export interface Hero {
  id: number;
  name: string;
  fullName: string;
  stars: number;
  primaryTags: string[];
  allTags: string[];
  stats: {
    attack: Stat;
    initiative: Stat;
    defense: Stat;
    movement: Stat;
  };
  statTotal: {
    base: number;
    boosted?: number;
  };
  abilities?: string[];
  playstyle?: string;
  synergies?: string[];
}

export type SortOption = 
  | 'nameAsc' 
  | 'nameDesc' 
  | 'starsAsc' 
  | 'starsDesc' 
  | 'statTotalAsc' 
  | 'statTotalDesc'
  | 'attackAsc'
  | 'attackDesc'
  | 'initiativeAsc'
  | 'initiativeDesc'
  | 'defenseAsc'
  | 'defenseDesc'
  | 'movementAsc'
  | 'movementDesc';

export interface GalleryContextType {
  heroes: Hero[];
  filteredHeroes: Hero[];
  selectedHero: Hero | null;
  isModalOpen: boolean;
  tagFilters: string[];
  starFilters: number[];
  sortOption: SortOption;
  selectHero: (hero: Hero) => void;
  closeModal: () => void;
  toggleTagFilter: (tag: string) => void;
  toggleStarFilter: (star: number) => void;
  setSortOption: (option: SortOption) => void;
  clearFilters: () => void;
}
