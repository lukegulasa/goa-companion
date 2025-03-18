
import React from 'react';
import { tagDefinitions } from '@/lib/types';
import { tagColors } from '@/lib/data';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import TagBadge from './TagBadge';

interface TagInfoPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TagInfoPanel: React.FC<TagInfoPanelProps> = ({ open, onOpenChange }) => {
  const tagEntries = Object.entries(tagDefinitions);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Hero Tags Reference</SheetTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Learn about the different hero tags and what they mean
          </p>
        </SheetHeader>
        
        <div className="space-y-6">
          {tagEntries.map(([tag, definition]) => (
            <div key={tag} className="border-b pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <TagBadge tag={tag} size="medium" />
                <h3 className="font-semibold">{tag}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{definition}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TagInfoPanel;
