
import React, { useState } from 'react';
import { GalleryProvider } from '@/context/GalleryContext';
import FilterBar from '@/components/FilterBar';
import HeroGrid from '@/components/HeroGrid';
import HeroModal from '@/components/HeroModal';
import TagInfoPanel from '@/components/TagInfoPanel';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';

const Index: React.FC = () => {
  const [tagInfoOpen, setTagInfoOpen] = useState(false);

  return (
    <GalleryProvider>
      <div className="container max-w-6xl mx-auto pt-4 px-4 sm:px-6 relative z-0">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5"
            onClick={() => setTagInfoOpen(true)}
          >
            <InfoIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Tag Reference</span>
          </Button>
        </div>

        <FilterBar />
        <HeroGrid />
        <HeroModal />
        <TagInfoPanel 
          open={tagInfoOpen} 
          onOpenChange={setTagInfoOpen} 
        />
      </div>
    </GalleryProvider>
  );
};

export default Index;
