
import { z } from "zod";

// Player & Game types
export interface Player {
  id: string;
  name: string;
}

export interface GamePlayer {
  playerId: string;
  playerName: string;
  team: 'Red' | 'Blue';
  heroId: number;
  heroName: string;
}

export interface Game {
  id: string;
  date: string; // ISO string
  players: GamePlayer[];
  winningTeam: 'Red' | 'Blue';
  victoryMethod?: 'Wave Counter' | 'Base Push' | 'Hero Kills';
}

// Form schemas for validation
export const newPlayerSchema = z.object({
  playerName: z.string().min(1, { message: "Player name is required" }),
});

export const gameLogSchema = z.object({
  date: z.date(),
  winningTeam: z.enum(['Red', 'Blue']),
  victoryMethod: z.enum(['Wave Counter', 'Base Push', 'Hero Kills']).optional(),
});

export type GameLogFormValues = z.infer<typeof gameLogSchema>;
export type NewPlayerFormValues = z.infer<typeof newPlayerSchema>;

// Stats calculation interfaces
export interface HeroStats {
  heroId: number;
  heroName: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

export interface HeroMatchupStats {
  heroId: number;
  opponentId: number;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

export interface HeroSynergyStats {
  heroId: number;
  allyId: number;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

export interface VictoryMethodStats {
  method: 'Wave Counter' | 'Base Push' | 'Hero Kills';
  count: number;
  percentage: number;
}
