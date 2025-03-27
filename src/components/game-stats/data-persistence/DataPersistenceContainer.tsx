
import React, { useState } from 'react';
import { AlertCircle, Badge } from 'lucide-react';
import { Game, Player } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';
import { SyncStatus } from '@/hooks/use-cloud-sync';
import { CloudSyncStatus } from './CloudSyncStatus';
import { DataActionButtons } from './DataActionButtons';
import { ImportExportDialog } from './ImportExportDialog';
import { SyncInfoCards } from './SyncInfoCards';

interface DataPersistenceContainerProps {
  games: Game[];
  players: Player[];
  onImport: (data: { games: Game[], players: Player[] }) => void;
  syncStatus?: SyncStatus;
  lastSynced: Date | null;
  onSyncNow: () => void;
  syncEnabled: boolean;
  onToggleSync: (enabled: boolean) => void;
}

export const DataPersistenceContainer: React.FC<DataPersistenceContainerProps> = ({ 
  games, 
  players,
  onImport,
  syncStatus = 'idle',
  lastSynced,
  onSyncNow,
  syncEnabled,
  onToggleSync
}) => {
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const isDataEmpty = games.length === 0 && players.length === 0;
  
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
  
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Data Management</h2>
          {syncEnabled && (
            <Badge variant={getSyncStatusColor(syncStatus)}>
              {getSyncStatusText(syncStatus)}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Your data is saved using IndexedDB and can be synchronized across devices.
        </p>
      </div>
      
      <CloudSyncStatus 
        syncStatus={syncStatus}
        lastSynced={lastSynced}
        onSyncNow={onSyncNow}
        syncEnabled={syncEnabled}
        onToggleSync={onToggleSync}
        gamesCount={games.length}
        playersCount={players.length}
      />
      
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
      
      <SyncInfoCards 
        syncEnabled={syncEnabled}
        gamesCount={games.length}
        playersCount={players.length}
      />
    </div>
  );

  function getSyncStatusColor(status: SyncStatus): "default" | "destructive" | "secondary" | "outline" | "green" | "yellow" {
    switch (status) {
      case 'synced': return 'green';
      case 'syncing': return 'yellow';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  }

  function getSyncStatusText(status: SyncStatus) {
    switch (status) {
      case 'synced': return 'Synced';
      case 'syncing': return 'Syncing...';
      case 'error': return 'Sync Error';
      case 'idle': return 'Idle';
      default: return 'Not synced';
    }
  }
};
