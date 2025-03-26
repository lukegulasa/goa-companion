
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star } from 'lucide-react';

interface HeroModalHeaderProps {
  fullName: string;
  stars: number;
}

export const HeroModalHeader: React.FC<HeroModalHeaderProps> = ({ fullName, stars }) => {
  return (
    <DialogHeader className="p-6 pb-2">
      <DialogTitle className="text-2xl flex items-center justify-between">
        <span>{fullName}</span>
        <div className="flex items-center">
          {Array.from({ length: stars }).map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
              strokeWidth={1}
            />
          ))}
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};
