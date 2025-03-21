import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavItemProps {
  name: string;
  path: string;
}

const NavItems = [
  { name: 'Home', path: '/' },
  { name: 'Draft', path: '/draft' },
  { name: 'Game Stats', path: '/game-stats' },
  { name: 'Team Balance', path: '/team-balance' },
];

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center space-x-6">
      {NavItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.path ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
