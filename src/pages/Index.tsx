
import React, { useState } from 'react';
import { GalleryProvider } from '@/context/GalleryContext';
import FilterBar from '@/components/FilterBar';
import HeroGrid from '@/components/HeroGrid';
import HeroModal from '@/components/HeroModal';
import TagInfoPanel from '@/components/TagInfoPanel';
import { Button } from '@/components/ui/button';
import { InfoIcon, BarChartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const [tagInfoOpen, setTagInfoOpen] = useState(false);

  return (
    <GalleryProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Guards of Atlantis II
              </h1>
              <p className="text-muted-foreground mt-1">
                Explore the heroes of the board game
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/game-stats">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5"
                >
                  <BarChartIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Game Stats</span>
                </Button>
              </Link>
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
          </div>
        </header>

        <main className="flex-1">
          <FilterBar />
          <HeroGrid />
          <HeroModal />
          <TagInfoPanel 
            open={tagInfoOpen} 
            onOpenChange={setTagInfoOpen} 
          />
        </main>
      </div>
    </GalleryProvider>
  );
};

export default Index;
