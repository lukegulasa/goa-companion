
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameHistoryFiltersProps {
  playerFilter: string;
  setPlayerFilter: (value: string) => void;
  heroFilter: string;
  setHeroFilter: (value: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

export const GameHistoryFilters: React.FC<GameHistoryFiltersProps> = ({
  playerFilter,
  setPlayerFilter,
  heroFilter,
  setHeroFilter,
  sortDirection,
  setSortDirection,
}) => {
  const isMobile = useIsMobile();
  
  const handleClearFilters = () => {
    setPlayerFilter('');
    setHeroFilter('');
  };
  
  const hasFilters = playerFilter || heroFilter;
  
  return (
    <div className="space-y-2">
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-4'}`}>
        {/* Player filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter by player..."
            value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Hero filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter by hero..."
            value={heroFilter}
            onChange={(e) => setHeroFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Sort and Clear buttons */}
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="flex gap-2 items-center"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Date: {sortDirection === 'asc' ? 'Oldest first' : 'Newest first'}</span>
          </Button>
          
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="flex gap-2 items-center"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear filters</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Filter indicators */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {playerFilter && (
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <span>Player: {playerFilter}</span>
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setPlayerFilter('')}
              />
            </div>
          )}
          {heroFilter && (
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <span>Hero: {heroFilter}</span>
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setHeroFilter('')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
