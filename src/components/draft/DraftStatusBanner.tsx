
import React from 'react';

interface DraftStatusBannerProps {
  currentCaptain: 'A' | 'B';
}

const DraftStatusBanner: React.FC<DraftStatusBannerProps> = ({ currentCaptain }) => {
  return (
    <div className="bg-muted/50 p-4 rounded-md mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${currentCaptain === 'A' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
          <span className="font-medium">
            Team {currentCaptain} Captain's turn to draft
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Select a player to add to your team
        </div>
      </div>
    </div>
  );
};

export default DraftStatusBanner;
