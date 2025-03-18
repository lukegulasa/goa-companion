
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { getAllTags } from '@/lib/data';
import { useGallery } from '@/context/GalleryContext';
import TagBadge from './TagBadge';
import { Star, Filter, SortAsc, SortDesc, X, ArrowUpAZ, ArrowDownAZ, Star as StarIcon, Gauge, Shield, Zap, MoveHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const FilterBar: React.FC = () => {
  const { 
    tagFilters, 
    starFilters, 
    sortOption, 
    toggleTagFilter, 
    toggleStarFilter, 
    setSortOption, 
    clearFilters 
  } = useGallery();
  
  const allTags = getAllTags();
  const [tagsPopoverOpen, setTagsPopoverOpen] = useState(false);
  
  const handleTagClick = (tag: string) => {
    toggleTagFilter(tag);
  };
  
  const handleStarClick = (star: number) => {
    toggleStarFilter(star);
  };
  
  const hasActiveFilters = tagFilters.length > 0 || starFilters.length > 0;
  
  return (
    <div className="w-full sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container max-w-6xl mx-auto py-4 px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          {/* Filter section */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tag filter */}
            <Popover open={tagsPopoverOpen} onOpenChange={setTagsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-4 w-4 mr-1" />
                  Tags
                  {tagFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 flex items-center justify-center">
                      {tagFilters.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Filter by tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag) => (
                      <TagBadge
                        key={tag}
                        tag={tag}
                        selected={tagFilters.includes(tag)}
                        onClick={() => handleTagClick(tag)}
                        size="small"
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Star filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <StarIcon className="h-4 w-4 mr-1" />
                  Stars
                  {starFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 flex items-center justify-center">
                      {starFilters.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="start">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Filter by stars</div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((star) => (
                      <Button
                        key={star}
                        variant={starFilters.includes(star) ? "default" : "outline"}
                        size="sm"
                        className="h-8 flex gap-1 items-center"
                        onClick={() => handleStarClick(star)}
                      >
                        {star}
                        <Star className={cn(
                          "h-3.5 w-3.5",
                          starFilters.includes(star) ? "fill-primary-foreground text-primary-foreground" : "fill-yellow-400 text-yellow-400"
                        )} strokeWidth={1} />
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Clear filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          
          {/* Sort section */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                {sortOption.includes('Asc') ? (
                  <SortAsc className="h-4 w-4 mr-1" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-1" />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>General</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => setSortOption('nameAsc')}
                className={cn("flex gap-2", sortOption === 'nameAsc' && "bg-muted")}
              >
                <ArrowUpAZ className="h-4 w-4" />
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('nameDesc')}
                className={cn("flex gap-2", sortOption === 'nameDesc' && "bg-muted")}
              >
                <ArrowDownAZ className="h-4 w-4" />
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('starsAsc')}
                className={cn("flex gap-2", sortOption === 'starsAsc' && "bg-muted")}
              >
                <StarIcon className="h-4 w-4" />
                Stars (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('starsDesc')}
                className={cn("flex gap-2", sortOption === 'starsDesc' && "bg-muted")}
              >
                <StarIcon className="h-4 w-4 fill-yellow-400" />
                Stars (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('statTotalAsc')}
                className={cn("flex gap-2", sortOption === 'statTotalAsc' && "bg-muted")}
              >
                <SortAsc className="h-4 w-4" />
                Stat Total (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('statTotalDesc')}
                className={cn("flex gap-2", sortOption === 'statTotalDesc' && "bg-muted")}
              >
                <SortDesc className="h-4 w-4" />
                Stat Total (High to Low)
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Stats</DropdownMenuLabel>
              
              {/* Attack */}
              <DropdownMenuItem 
                onClick={() => setSortOption('attackAsc')}
                className={cn("flex gap-2", sortOption === 'attackAsc' && "bg-muted")}
              >
                <Gauge className="h-4 w-4 text-red-500" />
                Attack (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('attackDesc')}
                className={cn("flex gap-2", sortOption === 'attackDesc' && "bg-muted")}
              >
                <Gauge className="h-4 w-4 text-red-500" />
                Attack (High to Low)
              </DropdownMenuItem>
              
              {/* Initiative */}
              <DropdownMenuItem 
                onClick={() => setSortOption('initiativeAsc')}
                className={cn("flex gap-2", sortOption === 'initiativeAsc' && "bg-muted")}
              >
                <Zap className="h-4 w-4 text-yellow-500" />
                Initiative (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('initiativeDesc')}
                className={cn("flex gap-2", sortOption === 'initiativeDesc' && "bg-muted")}
              >
                <Zap className="h-4 w-4 text-yellow-500" />
                Initiative (High to Low)
              </DropdownMenuItem>
              
              {/* Defense */}
              <DropdownMenuItem 
                onClick={() => setSortOption('defenseAsc')}
                className={cn("flex gap-2", sortOption === 'defenseAsc' && "bg-muted")}
              >
                <Shield className="h-4 w-4 text-blue-500" />
                Defense (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('defenseDesc')}
                className={cn("flex gap-2", sortOption === 'defenseDesc' && "bg-muted")}
              >
                <Shield className="h-4 w-4 text-blue-500" />
                Defense (High to Low)
              </DropdownMenuItem>
              
              {/* Movement */}
              <DropdownMenuItem 
                onClick={() => setSortOption('movementAsc')}
                className={cn("flex gap-2", sortOption === 'movementAsc' && "bg-muted")}
              >
                <MoveHorizontal className="h-4 w-4 text-green-500" />
                Movement (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption('movementDesc')}
                className={cn("flex gap-2", sortOption === 'movementDesc' && "bg-muted")}
              >
                <MoveHorizontal className="h-4 w-4 text-green-500" />
                Movement (High to Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
