
import React from 'react';
import { Cloud, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SyncInfoCardsProps {
  syncEnabled: boolean;
  gamesCount: number;
  playersCount: number;
}

export const SyncInfoCards: React.FC<SyncInfoCardsProps> = ({
  syncEnabled,
  gamesCount,
  playersCount
}) => {
  if (syncEnabled) {
    return (
      <Card className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
          <Cloud className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium mb-1">Cloud Synchronization Enabled</p>
            <p>
              Your data ({gamesCount} games and {playersCount} players) is now synchronized across all your devices.
            </p>
            <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
              <li>Changes made on any device will automatically sync to all your other devices</li>
              <li>Data is securely stored in the cloud and locally on each device</li>
              <li>Works even when offline - changes will sync when you're back online</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
      <div className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
        <Database className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium mb-1">Local Storage Mode</p>
          <p>
            You have {gamesCount} game{gamesCount !== 1 ? 's' : ''} and {playersCount} player{playersCount !== 1 ? 's' : ''} stored locally.
            Enable cloud sync for cross-device access or use the export/import feature for manual transfers.
          </p>
        </div>
      </div>
    </Card>
  );
};
