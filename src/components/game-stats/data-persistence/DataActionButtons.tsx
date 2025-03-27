
import React from 'react';
import { Download, Upload, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataActionButtonsProps {
  onExport: () => void;
  onImportClick: () => void;
  onShareClick: () => void;
  isDataEmpty: boolean;
}

export const DataActionButtons: React.FC<DataActionButtonsProps> = ({
  onExport,
  onImportClick,
  onShareClick,
  isDataEmpty
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onExport}
        disabled={isDataEmpty}
      >
        <Download className="h-4 w-4" />
        Download Backup
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onShareClick}
        disabled={isDataEmpty}
      >
        <Share2 className="h-4 w-4" />
        Share Data
      </Button>
      
      <div className="relative">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 w-full"
          onClick={onImportClick}
        >
          <Upload className="h-4 w-4" />
          Import File
        </Button>
      </div>
    </div>
  );
};
