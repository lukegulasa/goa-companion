
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy, Download } from 'lucide-react';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jsonData: string;
  onJsonDataChange: (data: string) => void;
  onCopyToClipboard: () => void;
  onImportFromText: (text: string) => void;
  isAdmin?: boolean;
}

export const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
  open,
  onOpenChange,
  jsonData,
  onJsonDataChange,
  onCopyToClipboard,
  onImportFromText,
  isAdmin = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Game Data</DialogTitle>
          <DialogDescription>
            Copy this JSON data or paste shared data to import
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          className="font-mono text-xs h-[300px]"
          value={jsonData}
          onChange={(e) => onJsonDataChange(e.target.value)}
          spellCheck={false}
        />
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="secondary" 
            className="w-full sm:w-auto" 
            onClick={onCopyToClipboard}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          
          {isAdmin && (
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              onClick={() => onImportFromText(jsonData)}
              disabled={!jsonData}
            >
              <Download className="mr-2 h-4 w-4" />
              Import from Text
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
