
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Sword, Target, BarChart3, Users } from 'lucide-react';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const NavItems: NavItemProps[] = [
  { name: 'Home', path: '/', icon: <Sword className="w-4 h-4" /> },
  { name: 'Draft', path: '/draft', icon: <Target className="w-4 h-4" /> },
  { name: 'Game Stats', path: '/game-stats', icon: <BarChart3 className="w-4 h-4" /> },
  { name: 'Team Balance', path: '/team-balance', icon: <Users className="w-4 h-4" /> },
];

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between">
      <div className="font-serif text-xl text-amber-900 dark:text-amber-500 font-semibold">
        GoA Companion
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        {NavItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/30",
              location.pathname === item.path 
                ? "text-amber-900 dark:text-amber-500 bg-amber-100/80 dark:bg-amber-900/20 tribal-border" 
                : "text-muted-foreground"
            )}
          >
            <span className="mr-2">{item.icon}</span>
            <span className="hidden sm:block font-serif">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
