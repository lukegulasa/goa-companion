
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Sword, Target, BarChart3, Users, Menu, X } from 'lucide-react';
import AuthButton from './AuthButton';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [open, setOpen] = useState(false);

  // Desktop navigation items
  const NavLinks = () => (
    <>
      {NavItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/30",
            location.pathname === item.path 
              ? "text-amber-900 dark:text-amber-500 bg-amber-100/80 dark:bg-amber-900/20 tribal-border" 
              : "text-muted-foreground"
          )}
        >
          <span className="mr-2">{item.icon}</span>
          <span className="font-serif">{item.name}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="flex items-center justify-between">
      <div className="font-serif text-xl text-amber-900 dark:text-amber-500 font-semibold">
        GoA Companion
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center">
        <div className="flex items-center space-x-2 mr-2">
          <NavLinks />
        </div>
        <AuthButton />
      </div>
      
      {/* Mobile Navigation */}
      <div className="flex items-center md:hidden">
        <AuthButton />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="ml-2 p-2 text-muted-foreground rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/30">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-background">
            <div className="flex flex-col space-y-4 py-4">
              <div className="font-serif text-lg mb-4 text-amber-900 dark:text-amber-500 font-semibold">
                Navigation
              </div>
              <div className="flex flex-col space-y-1">
                <NavLinks />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;
