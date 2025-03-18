
import { Hero } from './types';

// Process the raw data to generate stat totals
const processHeroData = (heroes: Hero[]): Hero[] => {
  return heroes.map(hero => {
    const baseStatTotal = 
      hero.stats.attack.base + 
      hero.stats.initiative.base + 
      hero.stats.defense.base + 
      hero.stats.movement.base;
    
    let boostedStatTotal: number | undefined;
    
    if (
      hero.stats.attack.boosted || 
      hero.stats.initiative.boosted || 
      hero.stats.defense.boosted || 
      hero.stats.movement.boosted
    ) {
      boostedStatTotal = 
        (hero.stats.attack.boosted || hero.stats.attack.base) + 
        (hero.stats.initiative.boosted || hero.stats.initiative.base) + 
        (hero.stats.defense.boosted || hero.stats.defense.base) + 
        (hero.stats.movement.boosted || hero.stats.movement.base);
    }
    
    return {
      ...hero,
      statTotal: {
        base: baseStatTotal,
        ...(boostedStatTotal && { boosted: boostedStatTotal })
      }
    };
  });
};

// Hero data from the provided table
export const heroes: Hero[] = processHeroData([
  {
    id: 1,
    name: "Arien",
    fullName: "Arien the Tidemaster",
    stars: 1,
    primaryTags: ["Tactician", "Disabler"],
    allTags: ["Tactician", "Disabler", "Durable", "Pusher"],
    stats: {
      attack: { base: 8 },
      initiative: { base: 4 },
      defense: { base: 5, boosted: 6 },
      movement: { base: 5, boosted: 6 }
    },
    statTotal: { base: 22, boosted: 24 }
  },
  {
    id: 2,
    name: "Brogan",
    fullName: "Brogan the Destroyer",
    stars: 1,
    primaryTags: ["Durable", "Disabler"],
    allTags: ["Durable", "Disabler", "Pusher", "Farming"],
    stats: {
      attack: { base: 7 },
      initiative: { base: 1 },
      defense: { base: 8 },
      movement: { base: 2, boosted: 4 }
    },
    statTotal: { base: 18, boosted: 20 }
  },
  {
    id: 3,
    name: "Tigerclaw",
    fullName: "Tigerclaw the Outpurse",
    stars: 1,
    primaryTags: ["Melee", "Disabler"],
    allTags: ["Melee", "Disabler", "Farming"],
    stats: {
      attack: { base: 4, boosted: 8 },
      initiative: { base: 8 },
      defense: { base: 1, boosted: 4 },
      movement: { base: 7, boosted: 8 }
    },
    statTotal: { base: 20, boosted: 28 }
  },
  {
    id: 4,
    name: "Wasp",
    fullName: "Wasp the Warmaiden",
    stars: 1,
    primaryTags: ["Disabler", "Tactician"],
    allTags: ["Disabler", "Tactician", "Sniper"],
    stats: {
      attack: { base: 5 },
      initiative: { base: 6 },
      defense: { base: 4, boosted: 5 },
      movement: { base: 5 }
    },
    statTotal: { base: 20, boosted: 21 }
  },
  {
    id: 5,
    name: "Sabina",
    fullName: "Sabina the Gunslinger",
    stars: 1,
    primaryTags: ["Tactician", "Pusher"],
    allTags: ["Tactician", "Pusher"],
    stats: {
      attack: { base: 1, boosted: 8 },
      initiative: { base: 5 },
      defense: { base: 3 },
      movement: { base: 5, boosted: 6 }
    },
    statTotal: { base: 14, boosted: 22 }
  },
  {
    id: 6,
    name: "Xargatha",
    fullName: "Xargatha the Changed",
    stars: 1,
    primaryTags: ["Tactician", "Pusher"],
    allTags: ["Tactician", "Pusher", "Disabler", "Durable", "Sniper"],
    stats: {
      attack: { base: 5, boosted: 8 },
      initiative: { base: 4 },
      defense: { base: 6 },
      movement: { base: 5 }
    },
    statTotal: { base: 20, boosted: 23 }
  },
  {
    id: 7,
    name: "Dodger",
    fullName: "Dodger the Warlock",
    stars: 1,
    primaryTags: ["Damager", "Sniper"],
    allTags: ["Damager", "Sniper", "Pusher", "Farming", "Disabler"],
    stats: {
      attack: { base: 3 },
      initiative: { base: 7 },
      defense: { base: 2, boosted: 5 },
      movement: { base: 5 }
    },
    statTotal: { base: 17, boosted: 20 }
  },
  {
    id: 8,
    name: "Rowenna",
    fullName: "Rowenna the Vanguard",
    stars: 2,
    primaryTags: ["Melee", "Durable"],
    allTags: ["Melee", "Durable", "Healer", "Farming", "Pusher", "Tactician"],
    stats: {
      attack: { base: 8 },
      initiative: { base: 4 },
      defense: { base: 7 },
      movement: { base: 3, boosted: 5 }
    },
    statTotal: { base: 22, boosted: 24 }
  },
  {
    id: 9,
    name: "Garrus",
    fullName: "Garrus the Gladiator",
    stars: 2,
    primaryTags: ["Disabler", "Durable"],
    allTags: ["Disabler", "Durable", "Tactician"],
    stats: {
      attack: { base: 8 },
      initiative: { base: 3 },
      defense: { base: 7 },
      movement: { base: 5, boosted: 6 }
    },
    statTotal: { base: 23, boosted: 24 }
  },
  {
    id: 10,
    name: "Bain",
    fullName: "Bain the Bountyhunter",
    stars: 2,
    primaryTags: ["Tactician", "Sniper"],
    allTags: ["Tactician", "Sniper", "Healer", "Farming", "Durable"],
    stats: {
      attack: { base: 5 },
      initiative: { base: 4 },
      defense: { base: 4, boosted: 6 },
      movement: { base: 5, boosted: 6 }
    },
    statTotal: { base: 18, boosted: 21 }
  },
  {
    id: 11,
    name: "Whisper",
    fullName: "Whisper the Outcast",
    stars: 2,
    primaryTags: ["Damager", "Durable"],
    allTags: ["Damager", "Durable", "Tactician", "Pusher"],
    stats: {
      attack: { base: 7 },
      initiative: { base: 7 },
      defense: { base: 4 },
      movement: { base: 3, boosted: 5 }
    },
    statTotal: { base: 21, boosted: 23 }
  },
  {
    id: 12,
    name: "Misa",
    fullName: "Misa the Samurai",
    stars: 2,
    primaryTags: ["Tactician", "Durable"],
    allTags: ["Tactician", "Durable", "Damager"],
    stats: {
      attack: { base: 6 },
      initiative: { base: 7 },
      defense: { base: 5 },
      movement: { base: 1, boosted: 8 }
    },
    statTotal: { base: 19, boosted: 26 }
  },
  {
    id: 13,
    name: "Ursafar",
    fullName: "Ursafar the Savage",
    stars: 2,
    primaryTags: ["Durable", "Pusher"],
    allTags: ["Durable", "Pusher", "Farming", "Melee"],
    stats: {
      attack: { base: 6 },
      initiative: { base: 5 },
      defense: { base: 6 },
      movement: { base: 1, boosted: 5 }
    },
    statTotal: { base: 18, boosted: 22 }
  },
  {
    id: 14,
    name: "Silvenarrow",
    fullName: "Silvenarrow the Pathfinder",
    stars: 2,
    primaryTags: ["Sniper", "Damager"],
    allTags: ["Sniper", "Damager", "Disabler", "Healer", "Farming"],
    stats: {
      attack: { base: 2 },
      initiative: { base: 7 },
      defense: { base: 1 },
      movement: { base: 6, boosted: 7 }
    },
    statTotal: { base: 16, boosted: 17 }
  },
  {
    id: 15,
    name: "Min",
    fullName: "Min the Dragonmonk",
    stars: 2,
    primaryTags: ["Tokens", "Disabler"],
    allTags: ["Tokens", "Disabler", "Damager", "Melee"],
    stats: {
      attack: { base: 4, boosted: 8 },
      initiative: { base: 8 },
      defense: { base: 3, boosted: 8 },
      movement: { base: 6 }
    },
    statTotal: { base: 21, boosted: 30 }
  },
  {
    id: 16,
    name: "Mrak",
    fullName: "Mrak the Rockshaper",
    stars: 3,
    primaryTags: ["Melee", "Tokens"],
    allTags: ["Melee", "Tokens", "Durable", "Disabler", "Tactician"],
    stats: {
      attack: { base: 8 },
      initiative: { base: 1 },
      defense: { base: 8 },
      movement: { base: 2, boosted: 4 }
    },
    statTotal: { base: 19, boosted: 21 }
  },
  {
    id: 17,
    name: "Cutter",
    fullName: "Cutter the Sky Pirate",
    stars: 3,
    primaryTags: ["Tactician", "Disabler"],
    allTags: ["Tactician", "Disabler", "Farming"],
    stats: {
      attack: { base: 4, boosted: 8 },
      initiative: { base: 6 },
      defense: { base: 4 },
      movement: { base: 4, boosted: 8 }
    },
    statTotal: { base: 18, boosted: 26 }
  },
  {
    id: 18,
    name: "Trinkels",
    fullName: "Trinkels the Scavenger",
    stars: 3,
    primaryTags: ["Sniper", "Damager"],
    allTags: ["Sniper", "Damager", "Pusher"],
    stats: {
      attack: { base: 3, boosted: 5 },
      initiative: { base: 6 },
      defense: { base: 2, boosted: 4 },
      movement: { base: 7, boosted: 8 }
    },
    statTotal: { base: 18, boosted: 23 }
  },
  {
    id: 19,
    name: "Tali",
    fullName: "Tali the Spiritcaller",
    stars: 3,
    primaryTags: ["Damager", "Pusher"],
    allTags: ["Damager", "Pusher", "Healer", "Durable", "Tokens"],
    stats: {
      attack: { base: 4, boosted: 6 },
      initiative: { base: 5, boosted: 8 },
      defense: { base: 4 },
      movement: { base: 5 }
    },
    statTotal: { base: 18, boosted: 23 }
  },
  {
    id: 20,
    name: "Swift",
    fullName: "Swift the Sharpshooter",
    stars: 3,
    primaryTags: ["Sniper", "Farming"],
    allTags: ["Sniper", "Farming", "Tactician"],
    stats: {
      attack: { base: 5 },
      initiative: { base: 4 },
      defense: { base: 2 },
      movement: { base: 7 }
    },
    statTotal: { base: 18 }
  },
  {
    id: 21,
    name: "Wuk",
    fullName: "Wuk the Grovekeeper",
    stars: 3,
    primaryTags: ["Tokens", "Pusher"],
    allTags: ["Tokens", "Pusher", "Durable", "Sniper", "Tactician", "Healer"],
    stats: {
      attack: { base: 5 },
      initiative: { base: 1 },
      defense: { base: 8 },
      movement: { base: 3, boosted: 4 }
    },
    statTotal: { base: 17, boosted: 18 }
  },
  {
    id: 22,
    name: "Hanu",
    fullName: "Hanu the Trickster",
    stars: 3,
    primaryTags: ["Tactician", "Sniper"],
    allTags: ["Tactician", "Sniper", "Pusher"],
    stats: {
      attack: { base: 4 },
      initiative: { base: 8 },
      defense: { base: 1 },
      movement: { base: 7, boosted: 8 }
    },
    statTotal: { base: 20, boosted: 21 }
  },
  {
    id: 23,
    name: "Brynn",
    fullName: "Brynn the Seeker",
    stars: 3,
    primaryTags: ["Tactician", "Damager"],
    allTags: ["Tactician", "Damager", "Durable"],
    stats: {
      attack: { base: 4, boosted: 8 },
      initiative: { base: 7 },
      defense: { base: 4 },
      movement: { base: 5, boosted: 6 }
    },
    statTotal: { base: 20, boosted: 25 }
  },
  {
    id: 24,
    name: "Mortimer",
    fullName: "Mortimer the Awakener",
    stars: 3,
    primaryTags: ["Melee", "Tokens"],
    allTags: ["Melee", "Tokens", "Farming", "Durable", "Pusher"],
    stats: {
      attack: { base: 8 },
      initiative: { base: 2 },
      defense: { base: 7 },
      movement: { base: 4 }
    },
    statTotal: { base: 21 }
  },
  {
    id: 25,
    name: "Widget and Pyro",
    fullName: "Widget and Pyro",
    stars: 3,
    primaryTags: ["Tactician", "Pusher"],
    allTags: ["Tactician", "Pusher", "Damager"],
    stats: {
      attack: { base: 5 },
      initiative: { base: 4 },
      defense: { base: 4 },
      movement: { base: 5, boosted: 6 }
    },
    statTotal: { base: 18, boosted: 19 }
  },
  {
    id: 26,
    name: "Snorri",
    fullName: "Snorri the Runescribe",
    stars: 4,
    primaryTags: ["Sniper", "Farming"],
    allTags: ["Sniper", "Farming", "Durable", "Damager", "Pusher", "Healer"],
    stats: {
      attack: { base: 5, boosted: 6 },
      initiative: { base: 2 },
      defense: { base: 5, boosted: 6 },
      movement: { base: 4, boosted: 5 }
    },
    statTotal: { base: 16, boosted: 19 }
  },
  {
    id: 27,
    name: "Razzle",
    fullName: "Razzle the Ringmaster",
    stars: 4,
    primaryTags: ["Tactician", "Melee"],
    allTags: ["Tactician", "Melee"],
    stats: {
      attack: { base: 3 },
      initiative: { base: 8 },
      defense: { base: 1, boosted: 4 },
      movement: { base: 5, boosted: 6 }
    },
    statTotal: { base: 17, boosted: 21 }
  },
  {
    id: 28,
    name: "Gydion",
    fullName: "Gydion the Archwizard",
    stars: 4,
    primaryTags: ["Sniper", "Tactician"],
    allTags: ["Sniper", "Tactician", "Farming", "Damager", "Pusher", "Tokens"],
    stats: {
      attack: { base: 5, boosted: 6 },
      initiative: { base: 3 },
      defense: { base: 3, boosted: 5 },
      movement: { base: 1, boosted: 4 }
    },
    statTotal: { base: 12, boosted: 18 }
  },
  {
    id: 29,
    name: "Nebkher",
    fullName: "Nebkher the Harbinger",
    stars: 4,
    primaryTags: ["Disabler", "Tokens"],
    allTags: ["Disabler", "Tokens", "Sniper"],
    stats: {
      attack: { base: 2, boosted: 3 },
      initiative: { base: 1 },
      defense: { base: 5, boosted: 6 },
      movement: { base: 2, boosted: 5 }
    },
    statTotal: { base: 10, boosted: 15 }
  },
  {
    id: 30,
    name: "Ignalia",
    fullName: "Ignalia the Mad",
    stars: 4,
    primaryTags: ["Sniper", "Damager"],
    allTags: ["Sniper", "Damager", "Tokens", "Tactician", "Pusher"],
    stats: {
      attack: { base: 5 },
      initiative: { base: 2 },
      defense: { base: 6 },
      movement: { base: 4, boosted: 5 }
    },
    statTotal: { base: 17, boosted: 18 }
  },
  {
    id: 31,
    name: "Takahide",
    fullName: "Takahide the Warlord",
    stars: 4,
    primaryTags: ["Durable", "Sniper"],
    allTags: ["Durable", "Sniper", "Tactician", "Damager", "Farming"],
    stats: {
      attack: { base: 5, boosted: 7 },
      initiative: { base: 3, boosted: 5 },
      defense: { base: 4, boosted: 7 },
      movement: { base: 1, boosted: 4 }
    },
    statTotal: { base: 13, boosted: 23 }
  },
  {
    id: 32,
    name: "Emmitt",
    fullName: "Emmitt the Traveler",
    stars: 4,
    primaryTags: ["Melee", "Tactician"],
    allTags: ["Melee", "Tactician", "Durable", "Disabler", "Tokens"],
    stats: {
      attack: { base: 5, boosted: 8 },
      initiative: { base: 1 },
      defense: { base: 6 },
      movement: { base: 2, boosted: 4 }
    },
    statTotal: { base: 14, boosted: 19 }
  }
]);

export const getAllTags = (): string[] => {
  const tagsSet = new Set<string>();
  
  heroes.forEach(hero => {
    hero.allTags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  
  return Array.from(tagsSet).sort();
};

export const tagColors: Record<string, string> = {
  Tactician: 'bg-tag-tactician',
  Disabler: 'bg-tag-disabler',
  Durable: 'bg-tag-durable',
  Pusher: 'bg-tag-pusher',
  Farming: 'bg-tag-farming',
  Sniper: 'bg-tag-sniper',
  Melee: 'bg-tag-melee',
  Damager: 'bg-tag-damager',
  Healer: 'bg-tag-healer',
  Tokens: 'bg-tag-tokens'
};
