
import React from 'react';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { useCloudSync } from '@/hooks/cloud-sync';
import { useToast } from '@/hooks/use-toast';
import { SyncStatus } from '@/hooks/cloud-sync/types';
import { useIsMobile } from '@/hooks/use-mobile';

export const DataPersistenceContainer: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
  
  // Map to combined status
  const combinedStatus: SyncStatus = 
    playersSyncStatus === 'syncing' || gamesSyncStatus === 'syncing' ? 'syncing' : 
    playersSyncStatus === 'error' || gamesSyncStatus === 'error' ? 'error' : 
    playersSyncStatus === 'synced' && gamesSyncStatus === 'synced' ? 'synced' : 'idle';
  
  return (
    <div className={`bg-card rounded-lg border shadow-sm ${isMobile ? 'p-2' : 'p-6'} space-y-1 sm:space-y-2`}>
      <div className="flex flex-col space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <h2 className={`${isMobile ? 'text-base' : 'text-xl'} font-semibold`}>Game Database</h2>
          <CloudSyncIndicator 
            syncStatus={combinedStatus}
            onSyncNow={handleSyncNow}
          />
        </div>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
          Your data is stored in Supabase. All changes are saved directly to the database.
        </p>
      </div>
    </div>
  );
};
