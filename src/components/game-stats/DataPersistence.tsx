import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, AlertCircle, Copy, Share2, QrCode, Database, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Game, Player } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';
import { SyncStatus } from '@/hooks/use-cloud-sync';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface DataPersistenceProps {
  games: Game[];
  players: Player[];
  onImport: (data: { games: Game[], players: Player[] }) => void;
  syncStatus?: SyncStatus;
  lastSynced: Date | null;
  onSyncNow: () => void;
  syncEnabled: boolean;
  onToggleSync: (enabled: boolean) => void;
}

export const DataPersistence: React.FC<DataPersistenceProps> = ({ 
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
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExport}
          disabled={games.length === 0 && players.length === 0}
        >
          <Download className="h-4 w-4" />
          Download Backup
        </Button>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleGenerateShareableData}
              disabled={games.length === 0 && players.length === 0}
            >
              <Share2 className="h-4 w-4" />
              Share Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Transfer Your Game Data</DialogTitle>
              <DialogDescription>
                Copy this data and paste it on another device or browser to transfer your game statistics.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="export" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="import">Import</TabsTrigger>
              </TabsList>
              
              <TabsContent value="export" className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Copy this text and save it somewhere safe. You can paste it on another device.
                  </p>
                  <Textarea 
                    value={jsonData} 
                    readOnly 
                    className="h-[200px] font-mono text-xs"
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="import" className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Paste the exported data here to import your game statistics.
                  </p>
                  <Textarea 
                    placeholder="Paste your data here..." 
                    className="h-[200px] font-mono text-xs"
                    onChange={(e) => setJsonData(e.target.value)}
                    value={jsonData}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={() => handleImportFromText(jsonData)}
                    disabled={!jsonData}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="relative">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full"
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="h-4 w-4" />
            Import File
          </Button>
          <input 
            type="file" 
            id="import-file"
            accept=".json" 
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>
      
      {syncEnabled ? (
        <Card className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
            <Cloud className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium mb-1">Cloud Synchronization Enabled</p>
              <p>
                Your data ({games.length} games and {players.length} players) is now synchronized across all your devices.
              </p>
              <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                <li>Changes made on any device will automatically sync to all your other devices</li>
                <li>Data is securely stored in the cloud and locally on each device</li>
                <li>Works even when offline - changes will sync when you're back online</li>
              </ul>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <div className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
            <Database className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium mb-1">Local Storage Mode</p>
              <p>
                You have {games.length} game{games.length !== 1 ? 's' : ''} and {players.length} player{players.length !== 1 ? 's' : ''} stored locally.
                Enable cloud sync for cross-device access or use the export/import feature for manual transfers.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
