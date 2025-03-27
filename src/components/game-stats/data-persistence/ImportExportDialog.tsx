
import React from 'react';
import { Copy, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jsonData: string;
  onJsonDataChange: (data: string) => void;
  onCopyToClipboard: () => void;
  onImportFromText: (text: string) => void;
}

export const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
  open,
  onOpenChange,
  jsonData,
  onJsonDataChange,
  onCopyToClipboard,
  onImportFromText
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onClick={onCopyToClipboard}
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
                onChange={(e) => onJsonDataChange(e.target.value)}
                value={jsonData}
              />
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => onImportFromText(jsonData)}
                disabled={!jsonData}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
