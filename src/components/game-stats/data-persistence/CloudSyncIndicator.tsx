
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, CloudOff, CheckCircle, RefreshCw } from 'lucide-react';
import { SyncStatus } from '@/hooks/cloud-sync/types';

interface CloudSyncIndicatorProps {
  syncStatus: SyncStatus;
  syncEnabled: boolean;
  onSyncNow: () => void;
  onToggleSync: (enabled: boolean) => void;
  isAdmin?: boolean;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  syncStatus,
  syncEnabled,
  onSyncNow,
  onToggleSync,
  isAdmin = false,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center">
        <span className="text-sm mr-2">Cloud Sync</span>
        <Switch 
          checked={syncEnabled} 
          onCheckedChange={onToggleSync} 
          disabled={!isAdmin && !syncEnabled} // Non-admins can't disable, but can enable
        />
      </div>
      
      {syncEnabled && (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSyncNow}
            disabled={syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Sync Now
          </Button>
          
          <div className="flex items-center">
            {syncStatus === 'syncing' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-xs ml-1 text-muted-foreground">Syncing...</span>
              </>
            )}
            {syncStatus === 'synced' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs ml-1 text-muted-foreground">Synced</span>
              </>
            )}
            {syncStatus === 'error' && (
              <>
                <CloudOff className="h-4 w-4 text-red-500" />
                <span className="text-xs ml-1 text-muted-foreground">Error</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
