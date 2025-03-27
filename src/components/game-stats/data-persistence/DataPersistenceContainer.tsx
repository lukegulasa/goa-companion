
import React, { useState } from 'react';
import { Game, Player } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';
import { DataActionButtons } from './DataActionButtons';
import { ImportExportDialog } from './ImportExportDialog';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { useCloudSync } from '@/hooks/cloud-sync';

interface DataPersistenceContainerProps {
  games: Game[];
  players: Player[];
  onImport: (data: { games: Game[], players: Player[] }) => void;
}

export const DataPersistenceContainer: React.FC<DataPersistenceContainerProps> = ({ 
  games, 
  players,
  onImport
}) => {
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const isDataEmpty = games.length === 0 && players.length === 0;
  
  // Get sync status from the hooks
  const { syncStatus: playersSyncStatus, syncNow: syncPlayers, syncEnabled, setSyncEnabled } = useCloudSync('players');
  const { syncStatus: gamesSyncStatus, syncNow: syncGames } = useCloudSync('games');
  
  const handleExport = () => {
    try {
      const dataToExport = {
        games,
        players,
        exportDate: new Date().toISOString()
      };
      
      const jsonData = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `game-stats-export-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your game data has been exported successfully."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your data."
      });
    }
  };
  
  const handleGenerateShareableData = () => {
    try {
      const dataToExport = {
        games,
        players,
        exportDate: new Date().toISOString()
      };
      
      const data = JSON.stringify(dataToExport);
      setJsonData(data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Generate shareable data error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error generating shareable data."
      });
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonData).then(
      () => {
        toast({
          title: "Copied!",
          description: "Data copied to clipboard. Paste it in another browser to import."
        });
      },
      (err) => {
        console.error('Copy error:', err);
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Failed to copy data to clipboard."
        });
      }
    );
  };
  
  const handleImportFromText = (text: string) => {
    try {
      const importedData = JSON.parse(text);
      
      if (!importedData.games || !importedData.players || !Array.isArray(importedData.games) || !Array.isArray(importedData.players)) {
        throw new Error('Invalid import format');
      }
      
      onImport({
        games: importedData.games,
        players: importedData.players
      });
      
      toast({
        title: "Import Successful",
        description: `Imported ${importedData.games.length} games and ${importedData.players.length} players.`
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('JSON parsing error:', error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "The data appears to be invalid or corrupt."
      });
    }
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          handleImportFromText(content);
        } catch (error) {
          console.error('JSON parsing error:', error);
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "The selected file appears to be invalid or corrupt."
          });
        }
      };
      
      reader.readAsText(file);
      
      event.target.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "There was an error importing your data."
      });
    }
  };

  const handleImportButtonClick = () => {
    document.getElementById('import-file')?.click();
  };
  
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
          <h2 className="text-xl font-semibold">Data Management</h2>
          <CloudSyncIndicator 
            syncStatus={playersSyncStatus === 'syncing' || gamesSyncStatus === 'syncing' ? 'syncing' : 
                        playersSyncStatus === 'error' || gamesSyncStatus === 'error' ? 'error' : 'synced'}
            syncEnabled={syncEnabled}
            onSyncNow={handleSyncNow}
            onToggleSync={handleToggleSync}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Your data is saved in Supabase and synced across devices. Export your data to create backups or transfer between browsers.
        </p>
      </div>
      
      <DataActionButtons 
        onExport={handleExport}
        onImportClick={handleImportButtonClick}
        onShareClick={handleGenerateShareableData}
        isDataEmpty={isDataEmpty}
      />
      
      <input 
        type="file" 
        id="import-file"
        accept=".json" 
        className="hidden"
        onChange={handleImport}
      />
      
      <ImportExportDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        jsonData={jsonData}
        onJsonDataChange={setJsonData}
        onCopyToClipboard={handleCopyToClipboard}
        onImportFromText={handleImportFromText}
      />
    </div>
  );
};
