
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { Game, Player } from '@/lib/game-stats-types';
import { useToast } from '@/hooks/use-toast';

interface DataPersistenceProps {
  games: Game[];
  players: Player[];
  onImport: (data: { games: Game[], players: Player[] }) => void;
}

export const DataPersistence: React.FC<DataPersistenceProps> = ({ 
  games, 
  players,
  onImport
}) => {
  const { toast } = useToast();
  
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
  
  // Import data from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content);
          
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
          Export your data to keep a backup or to transfer it to another device.
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
          Export Data
        </Button>
        
        <div className="relative">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full"
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="h-4 w-4" />
            Import Data
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
        <div className="flex items-start gap-2 p-3 text-sm bg-muted rounded text-muted-foreground">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            You currently have {games.length} game{games.length !== 1 ? 's' : ''} and {players.length} player{players.length !== 1 ? 's' : ''} stored locally.
            Importing new data will merge with your existing data.
          </p>
        </div>
      )}
    </div>
  );
};
