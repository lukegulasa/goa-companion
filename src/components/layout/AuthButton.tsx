
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const AuthButton: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };
  
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
            <span className="hidden sm:inline-block">{isAdmin ? 'Admin' : 'User'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-muted-foreground" disabled>
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/auth" className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline-block">Admin Login</span>
      </Link>
    </Button>
  );
};

export default AuthButton;
