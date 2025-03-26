
import Dexie, { Table } from 'dexie';
import { Game, Player } from './game-stats-types';

class GameDatabase extends Dexie {
  players!: Table<Player, string>;
  games!: Table<Game, string>;

  constructor() {
    super('gameStatsDatabase');
    this.version(1).stores({
      players: 'id, name',
      games: 'id, date, winningTeam'
    });
  }
}

export const db = new GameDatabase();

// Helper functions for database operations
export async function getPlayers(): Promise<Player[]> {
  return await db.players.toArray();
}

export async function getGames(): Promise<Game[]> {
  return await db.games.toArray();
}

export async function addPlayer(player: Player): Promise<string> {
  return await db.players.add(player);
}

export async function addGame(game: Game): Promise<string> {
  return await db.games.add(game);
}

export async function updateGame(gameId: string, updatedGame: Partial<Game>): Promise<number> {
  return await db.games.update(gameId, updatedGame);
}

export async function deleteGame(gameId: string): Promise<void> {
  await db.games.delete(gameId);
}

export async function importData(data: { games: Game[], players: Player[] }): Promise<void> {
  // Start a transaction to ensure data consistency
  await db.transaction('rw', [db.games, db.players], async () => {
    // Get existing IDs to avoid duplicates
    const existingPlayerIds = new Set((await db.players.toArray()).map(p => p.id));
    const existingGameIds = new Set((await db.games.toArray()).map(g => g.id));
    
    // Add only non-duplicate items
    await Promise.all([
      ...data.players
        .filter(p => !existingPlayerIds.has(p.id))
        .map(player => db.players.add(player)),
      ...data.games
        .filter(g => !existingGameIds.has(g.id))
        .map(game => db.games.add(game))
    ]);
  });
}
