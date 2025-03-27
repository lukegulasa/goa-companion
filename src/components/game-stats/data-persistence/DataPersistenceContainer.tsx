
import React from 'react';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { useCloudSync } from '@/hooks/cloud-sync';
import { useToast } from '@/hooks/use-toast';

interface DataPersistenceContainerProps {
  isAdmin?: boolean;
}

export const DataPersistenceContainer: React.FC<DataPersistenceContainerProps> = ({ 
  isAdmin = false
}) => {
  const { toast } = useToast();
  
  // Get sync status from the hooks
  const { syncStatus: playersSyncStatus, syncNow: syncPlayers, syncEnabled, setSyncEnabled } = useCloudSync('players');
  const { syncStatus: gamesSyncStatus, syncNow: syncGames } = useCloudSync('games');
  
  const handleSyncNow = () => {
    syncPlayers();
    syncGames();
    toast({
      title: "Sync Started",
      description: "Synchronizing your game data with the cloud..."
    });
  };
  
  const handleToggleSync = (enabled: boolean) => {
    setSyncEnabled(enabled);
    toast({
      title: enabled ? "Cloud Sync Enabled" : "Cloud Sync Disabled",
      description: enabled 
        ? "Your game data will now be automatically synced with the cloud."
        : "Your game data will no longer be synced with the cloud."
    });
  };
  
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cloud Database</h2>
          <CloudSyncIndicator 
            syncStatus={playersSyncStatus === 'syncing' || gamesSyncStatus === 'syncing' ? 'syncing' : 
                        playersSyncStatus === 'error' || gamesSyncStatus === 'error' ? 'error' : 'synced'}
            syncEnabled={syncEnabled}
            onSyncNow={handleSyncNow}
            onToggleSync={handleToggleSync}
            isAdmin={isAdmin}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Your data is stored in Supabase and automatically synchronized. All changes are saved directly to the database.
        </p>
      </div>
    </div>
  );
};
