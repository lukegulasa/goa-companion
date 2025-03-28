
import React from 'react';
import { useGallery } from '@/context/GalleryContext';
import TagFilter from './filters/TagFilter';
import StarFilter from './filters/StarFilter';
import SortMenu from './filters/SortMenu';
import ClearFiltersButton from './filters/ClearFiltersButton';

const FilterBar: React.FC = () => {
  const { tagFilters, starFilters } = useGallery();
  
  const hasActiveFilters = tagFilters.length > 0 || starFilters.length > 0;
  
  return (
    <div className="w-full sticky top-0 z-10 bg-background/80 dark:bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-6xl mx-auto py-4 px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          {/* Filter section */}
          <div className="flex flex-wrap items-center gap-2">
            <TagFilter />
            <StarFilter />
            <ClearFiltersButton hasActiveFilters={hasActiveFilters} />
          </div>
          
          {/* Sort section */}
          <SortMenu />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
