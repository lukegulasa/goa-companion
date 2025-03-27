
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Upload, Share2 } from 'lucide-react';

interface DataActionButtonsProps {
  onExport: () => void;
  onImportClick: () => void;
  onShareClick: () => void;
  isDataEmpty: boolean;
  isAdmin?: boolean;
}

export const DataActionButtons: React.FC<DataActionButtonsProps> = ({
  onExport,
  onImportClick,
  onShareClick,
  isDataEmpty,
  isAdmin = false,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center"
        onClick={onExport}
        disabled={isDataEmpty}
      >
        <DownloadCloud className="mr-2 h-4 w-4" />
        Export Data
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center"
        onClick={onImportClick}
        disabled={!isAdmin}
      >
        <Upload className="mr-2 h-4 w-4" />
        Import Data
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center"
        onClick={onShareClick}
        disabled={isDataEmpty}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Data
      </Button>
    </div>
  );
};
