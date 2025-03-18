
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BarChartIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="container max-w-6xl mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Guards of Atlantis II
          </h1>
          <p className="text-muted-foreground mt-1">
            Board Game Companion
          </p>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'outline'} 
                  className={cn("mr-2", 
                    isActive('/') && "bg-primary/90 hover:bg-primary"
                  )}
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Gallery
                </Button>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/game-stats">
                <Button 
                  variant={isActive('/game-stats') ? 'default' : 'outline'} 
                  className={cn(
                    isActive('/game-stats') && "bg-primary/90 hover:bg-primary"
                  )}
                >
                  <BarChartIcon className="mr-2 h-4 w-4" />
                  Game Stats
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
