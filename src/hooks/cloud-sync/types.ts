
import { Game, Player } from '@/lib/game-stats-types';

// This is used for backwards compatibility
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

// Fixed mapping type to directly use Player or Game based on T
export type DataType<T extends 'players' | 'games'> = T extends 'players' ? Player : Game;

// This defines the structure of our cloud sync hook return
export interface CloudSyncResult<T extends 'players' | 'games'> {
  data: DataType<T>[];
  setData: (value: DataType<T>[] | ((val: DataType<T>[]) => DataType<T>[])) => void;
  syncStatus: SyncStatus;
  lastSynced: Date | null;
  syncNow: () => Promise<void>;
  setSyncEnabled: (enabled: boolean) => void;
  syncEnabled: boolean;
}

// Constants kept for compatibility
export const SYNC_CONSTANTS = {
  INTERVAL: 60000,
  KEY_PREFIX: 'goa-sync-',
  ENABLED_KEY: 'goa-sync-enabled',
};
