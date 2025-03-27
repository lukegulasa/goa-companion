
import React from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { SyncStatus } from '@/hooks/cloud-sync/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CloudSyncIndicatorProps {
  syncStatus: SyncStatus;
  syncEnabled: boolean;
  onSyncNow: () => void;
  onToggleSync: (enabled: boolean) => void;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  syncStatus,
  syncEnabled,
  onSyncNow,
  onToggleSync
}) => {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-1">
              <Switch
                checked={syncEnabled}
                onCheckedChange={onToggleSync}
                id="sync-toggle"
              />
              <label htmlFor="sync-toggle" className="text-xs text-muted-foreground cursor-pointer">
                {syncEnabled ? (
                  <Cloud className="h-4 w-4" />
                ) : (
                  <CloudOff className="h-4 w-4" />
                )}
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{syncEnabled ? "Cloud sync enabled" : "Cloud sync disabled"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {syncEnabled && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={onSyncNow}
                disabled={syncStatus === 'syncing'}
              >
                <RefreshCw className={`h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sync now</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
