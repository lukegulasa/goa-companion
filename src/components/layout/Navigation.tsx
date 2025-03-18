
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BarChartIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto py-2 px-3 sm:px-6 sm:py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            {isMobile ? "GoA II" : "Guards of Atlantis II"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0 sm:mt-1">
            Board Game Companion
          </p>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'outline'} 
                  size={isMobile ? "sm" : "default"}
                  className={cn(
                    "mr-1 sm:mr-2", 
                    isActive('/') && "bg-primary/90 hover:bg-primary"
                  )}
                >
                  <HomeIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className={isMobile ? "text-xs" : ""}>Gallery</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/game-stats">
                <Button 
                  variant={isActive('/game-stats') ? 'default' : 'outline'} 
                  size={isMobile ? "sm" : "default"}
                  className={cn(
                    isActive('/game-stats') && "bg-primary/90 hover:bg-primary"
                  )}
                >
                  <BarChartIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className={isMobile ? "text-xs" : ""}>Game Stats</span>
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navigation;
