
import React from 'react';
import { format } from 'date-fns';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SyncStatus } from '@/hooks/use-cloud-sync';

interface CloudSyncStatusProps {
  syncStatus: SyncStatus;
  lastSynced: Date | null;
  onSyncNow: () => void;
  syncEnabled: boolean;
  onToggleSync: (enabled: boolean) => void;
  gamesCount: number;
  playersCount: number;
}

export const CloudSyncStatus: React.FC<CloudSyncStatusProps> = ({
  syncStatus,
  lastSynced,
  onSyncNow,
  syncEnabled,
  onToggleSync,
  gamesCount,
  playersCount
}) => {
  const getSyncStatusColor = (status: SyncStatus): "default" | "destructive" | "secondary" | "outline" | "green" | "yellow" => {
    switch (status) {
      case 'synced': return 'green';
      case 'syncing': return 'yellow';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getSyncStatusText = (status: SyncStatus) => {
    switch (status) {
      case 'synced': return 'Synced';
      case 'syncing': return 'Syncing...';
      case 'error': return 'Sync Error';
      case 'idle': return 'Idle';
      default: return 'Not synced';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
      <div className="flex items-center space-x-2">
        <Switch 
          id="sync-mode"
          checked={syncEnabled}
          onCheckedChange={onToggleSync}
        />
        <Label htmlFor="sync-mode" className="cursor-pointer">
          <div className="flex items-center gap-1.5">
            {syncEnabled ? (
              <Cloud className="h-4 w-4 text-primary" />
            ) : (
              <CloudOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Cross-Device Sync</span>
          </div>
        </Label>
      </div>
      
      {syncEnabled && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {lastSynced 
              ? `Last synced: ${format(lastSynced, 'MMM d, h:mm a')}` 
              : 'Not synced yet'}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSyncNow}
            disabled={syncStatus === 'syncing'}
            className="h-8 px-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span className="ml-1.5">Sync Now</span>
          </Button>
        </div>
      )}
    </div>
  );
};
