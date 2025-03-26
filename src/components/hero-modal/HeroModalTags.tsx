
import React from 'react';
import TagBadge from '@/components/TagBadge';

interface HeroModalTagsProps {
  tags: string[];
}

export const HeroModalTags: React.FC<HeroModalTagsProps> = ({ tags }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Tags
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
};
