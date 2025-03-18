import React from 'react';
import { tagColors } from '@/lib/data';
import { tagDefinitions } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TagBadgeProps {
  tag: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const TagBadge: React.FC<TagBadgeProps> = ({ 
  tag, 
  selected = false,
  onClick, 
  className,
  size = 'medium'
}) => {
  const isClickable = !!onClick;
  const colorClass = tagColors[tag] || 'bg-gray-500';
  
  const sizeClasses = {
    small: 'text-[10px] py-0.5 px-1.5',
    medium: 'text-xs py-1 px-2.5',
    large: 'text-sm py-1.5 px-3'
  };
  
  const tagBadge = (
    <span 
      className={cn(
        'hero-tag transition-all duration-150 inline-flex items-center justify-center',
        colorClass,
        sizeClasses[size],
        isClickable && 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-offset-background hover:ring-primary/50',
        selected && 'ring-2 ring-offset-1 ring-offset-background ring-primary',
        className
      )}
      onClick={onClick}
    >
      {tag}
    </span>
  );

  if (tagDefinitions[tag]) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {tagBadge}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tagDefinitions[tag]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return tagBadge;
};

export default TagBadge;
