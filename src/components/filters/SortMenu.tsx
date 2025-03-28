
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useGallery } from '@/context/GalleryContext';
import { SortOption } from '@/lib/types';
import { cn } from '@/lib/utils';
import { 
  SortAsc, 
  SortDesc, 
  ArrowUpAZ, 
  ArrowDownAZ, 
  Star, 
  Gauge, 
  Shield, 
  Zap, 
  MoveHorizontal, 
  BarChart 
} from 'lucide-react';

const SortMenu: React.FC = () => {
  const { sortOption, setSortOption } = useGallery();
  
  return (
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
          <Star className="h-4 w-4" />
          Stars (Low to High)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortOption('starsDesc')}
          className={cn("flex gap-2", sortOption === 'starsDesc' && "bg-muted")}
        >
          <Star className="h-4 w-4 fill-yellow-400" />
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

        {/* Win Rate sorting options */}
        <DropdownMenuItem 
          onClick={() => setSortOption('winRateAsc')}
          className={cn("flex gap-2", sortOption === 'winRateAsc' && "bg-muted")}
        >
          <BarChart className="h-4 w-4 text-blue-500" />
          Win Rate (Low to High)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortOption('winRateDesc')}
          className={cn("flex gap-2", sortOption === 'winRateDesc' && "bg-muted")}
        >
          <BarChart className="h-4 w-4 text-green-500" />
          Win Rate (High to Low)
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
  );
};

export default SortMenu;
