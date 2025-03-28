
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getAllTags } from '@/lib/data';
import { useGallery } from '@/context/GalleryContext';
import TagBadge from '@/components/TagBadge';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TagFilter: React.FC = () => {
  const { tagFilters, toggleTagFilter } = useGallery();
  const allTags = getAllTags();
  const [tagsPopoverOpen, setTagsPopoverOpen] = useState(false);
  
  const handleTagClick = (tag: string) => {
    toggleTagFilter(tag);
  };
  
  return (
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
  );
};

export default TagFilter;
