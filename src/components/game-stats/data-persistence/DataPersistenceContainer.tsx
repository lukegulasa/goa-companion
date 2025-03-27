
import React from 'react';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { useCloudSync } from '@/hooks/cloud-sync';
import { useToast } from '@/hooks/use-toast';

export const DataPersistenceContainer: React.FC = () => {
  const { toast } = useToast();
  
  // Get sync status from the hooks
  const { syncStatus: playersSyncStatus, syncNow: syncPlayers } = useCloudSync('players');
  const { syncStatus: gamesSyncStatus, syncNow: syncGames } = useCloudSync('games');
  
  const handleSyncNow = () => {
    syncPlayers();
    syncGames();
    toast({
      title: "Refreshing Data",
      description: "Updating your game data from the database..."
    });
  };
  
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Game Database</h2>
          <CloudSyncIndicator 
            syncStatus={playersSyncStatus === 'syncing' || gamesSyncStatus === 'syncing' ? 'syncing' : 
                      playersSyncStatus === 'error' || gamesSyncStatus === 'error' ? 'error' : 'synced'}
            onSyncNow={handleSyncNow}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Your data is stored in Supabase. All changes are saved directly to the database.
        </p>
      </div>
    </div>
  );
};
