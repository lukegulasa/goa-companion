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
  | 'movementDesc'
  | 'winRateAsc'
  | 'winRateDesc';

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

export const tagDefinitions: Record<string, string> = {
  Damager: "Damagers are heroes adept at forcing their opponents to discard cards. This weakens enemy heroes, making it easier for your allies to take them down.",
  Disabler: "Disablers possess the power to weaken enemy heroes by preventing or limiting their ability to perform certain actions.",
  Durable: "Durable heroes are best equipped to withstand the heat of battle and survive, usually achieving this through a combination of a high defense stat and self-healing abilities.",
  Farming: "Heroes with farming abilities can generate extra coins for themselves or their allies, enabling faster leveling and setting up stronger late game.",
  Healer: "Healers help their allies by letting them retrieve discarded cards, greatly increasing their changes of surviving the fight.",
  Melee: "These heroes are focused on attacking in close quarters. A team composed entirely of melee fighters is formidable in a brawl, but may struggle against fast ranged heroes and heroes capable of placing tokens.",
  Pusher: "These heroes are able to deal with more than two enemy minions each round, or protect and respawn their own minions, giving them an edge at pushing the lane.",
  Sniper: "Most heroes have access to some form of ranged attacks, while Snipers are capable of attacking enemy heroes and minions at a much longer range.",
  Tactician: "Tacticians specialize in controlling the battlefield by moving, pushing, or repositioning units. Their versatile abilities allow them to support allies and hinder enemies.",
  Tokens: "These heroes are capable of placing tokens - temporary obstacles with special qualities. Each such hero uses their own type of tokens and the icon will correspond to the ones used by this particular hero."
};
