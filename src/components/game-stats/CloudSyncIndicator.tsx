
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, CloudOff, RefreshCw } from 'lucide-react';
import { SyncStatus } from '@/hooks/cloud-sync/types';

interface CloudSyncIndicatorProps {
  syncStatus: SyncStatus;
  onSyncNow: () => void;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  syncStatus,
  onSyncNow,
}) => {
  return (
    <div className="flex items-center space-x-3">
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
        Refresh Data
      </Button>
      
      <div className="flex items-center">
        {syncStatus === 'syncing' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-xs ml-1 text-muted-foreground">Loading...</span>
          </>
        )}
        {syncStatus === 'synced' && (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs ml-1 text-muted-foreground">Data Ready</span>
          </>
        )}
        {syncStatus === 'error' && (
          <>
            <CloudOff className="h-4 w-4 text-red-500" />
            <span className="text-xs ml-1 text-muted-foreground">Error</span>
          </>
        )}
        {syncStatus === 'idle' && (
          <>
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <span className="text-xs ml-1 text-muted-foreground">Ready</span>
          </>
        )}
      </div>
    </div>
  );
};
