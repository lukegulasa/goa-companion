
import { z } from "zod";

// Player & Game types
export interface Player {
  id: string;
  name: string;
}

export interface GamePlayer {
  playerId: string;
  playerName: string;
  team: 'Atlantis' | 'Blight';
  heroId: number;
  heroName: string;
}

export interface Game {
  id: string;
  date: string; // ISO string
  players: GamePlayer[];
  winningTeam: 'Atlantis' | 'Blight';
  victoryMethod: 'Wave Counter' | 'Base Push' | 'Hero Kills';
}

// Form schemas for validation
export const newPlayerSchema = z.object({
  playerName: z.string().min(1, { message: "Player name is required" }),
});

export const gameLogSchema = z.object({
  date: z.date(),
  winningTeam: z.enum(['Atlantis', 'Blight']),
  victoryMethod: z.enum(['Wave Counter', 'Base Push', 'Hero Kills']),
});

export type GameLogFormValues = z.infer<typeof gameLogSchema>;
export type NewPlayerFormValues = z.infer<typeof newPlayerSchema>;
