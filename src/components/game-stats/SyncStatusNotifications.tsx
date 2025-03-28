
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SyncStatus } from '@/hooks/cloud-sync/types';

interface SyncStatusNotificationsProps {
  playersSyncStatus: SyncStatus;
  gamesSyncStatus: SyncStatus;
}

export const SyncStatusNotifications: React.FC<SyncStatusNotificationsProps> = ({
  playersSyncStatus,
  gamesSyncStatus
}) => {
  const { toast } = useToast();
  
  // Show toast notification when sync status changes
  useEffect(() => {
    if (playersSyncStatus === 'error' || gamesSyncStatus === 'error') {
      toast({
        title: "Sync Error",
        description: "There was an error syncing with the database. Please try again later.",
        variant: "destructive"
      });
    } else if (playersSyncStatus === 'synced' && gamesSyncStatus === 'synced') {
      toast({
        title: "Sync Complete",
        description: "Your game data has been synced with the database."
      });
    }
  }, [playersSyncStatus, gamesSyncStatus, toast]);
  
  return null; // This component doesn't render anything
};
