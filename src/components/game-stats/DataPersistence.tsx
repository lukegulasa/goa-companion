
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, AlertCircle, Copy, Share2, QrCode, Database } from 'lucide-react';
import { Game, Player } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';
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

interface DataPersistenceProps {
  games: Game[];
  players: Player[];
  onImport: (data: { games: Player[], players: Player[] }) => void;
}

export const DataPersistence: React.FC<DataPersistenceProps> = ({ 
  games, 
  players,
  onImport
}) => {
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Export data as JSON file
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
      
      // Clean up
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
  
  // Generate shareable JSON string
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
  
  // Copy JSON to clipboard
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
  
  // Import data from pasted JSON
  const handleImportFromText = (text: string) => {
    try {
      const importedData = JSON.parse(text);
      
      // Basic validation
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
  
  // Import data from JSON file
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
      
      // Reset file input
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
  
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-semibold">Data Management</h2>
        <p className="text-sm text-muted-foreground">
          Your data is now saved using IndexedDB, which provides persistent storage across sessions.
          You can still export your data as a backup or to transfer to another device.
        </p>
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
      
      {games.length > 0 && (
        <Card className="p-4 border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <div className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
            <Database className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium mb-1">Enhanced Data Storage</p>
              <p>
                You currently have {games.length} game{games.length !== 1 ? 's' : ''} and {players.length} player{players.length !== 1 ? 's' : ''} stored.
                Your data is now saved using IndexedDB, which:
              </p>
              <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                <li>Persists data between browser sessions</li>
                <li>Uses more reliable storage than localStorage</li>
                <li>Still works offline and without a server</li>
                <li>Can store more data than localStorage</li>
              </ul>
              <p className="mt-2">
                Note: Data is still tied to this browser. For cross-device access, use the export/import feature.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
