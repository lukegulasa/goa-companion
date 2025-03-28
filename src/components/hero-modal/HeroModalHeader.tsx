
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HeroModalHeaderProps {
  fullName: string;
  stars: number;
}

export const HeroModalHeader: React.FC<HeroModalHeaderProps> = ({ fullName }) => {
  return (
    <DialogHeader className="p-6 pb-2">
      <DialogTitle className="text-2xl font-roboto">
        <span>{fullName}</span>
      </DialogTitle>
    </DialogHeader>
  );
};
