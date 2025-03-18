
import React from 'react';
import { GalleryProvider } from '@/context/GalleryContext';
import FilterBar from '@/components/FilterBar';
import HeroGrid from '@/components/HeroGrid';
import HeroModal from '@/components/HeroModal';

const Index: React.FC = () => {
  return (
    <GalleryProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Guards of Atlantis II
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore the heroes of the board game
            </p>
          </div>
        </header>

        <main className="flex-1">
          <FilterBar />
          <HeroGrid />
          <HeroModal />
        </main>
      </div>
    </GalleryProvider>
  );
};

export default Index;
