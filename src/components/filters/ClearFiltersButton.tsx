
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useGallery } from '@/context/GalleryContext';

interface ClearFiltersButtonProps {
  hasActiveFilters: boolean;
}

const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({ hasActiveFilters }) => {
  const { clearFilters } = useGallery();
  
  if (!hasActiveFilters) return null;
  
  return (
    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
      <X className="h-4 w-4 mr-1" />
      Clear filters
    </Button>
  );
};

export default ClearFiltersButton;
