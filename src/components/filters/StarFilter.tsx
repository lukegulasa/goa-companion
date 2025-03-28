
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGallery } from '@/context/GalleryContext';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StarFilter: React.FC = () => {
  const { starFilters, toggleStarFilter } = useGallery();
  
  const handleStarClick = (star: number) => {
    toggleStarFilter(star);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Star className="h-4 w-4 mr-1" />
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
  );
};

export default StarFilter;
