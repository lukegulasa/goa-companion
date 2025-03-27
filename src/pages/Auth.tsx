
import React, { useEffect, useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const [makingAdmin, setMakingAdmin] = useState(false);
  const [hasAdmins, setHasAdmins] = useState(true);
  
  useEffect(() => {
    // Check if there are any admins in the system
    if (user) {
      const checkAdmins = async () => {
        try {
          const { data, error, count } = await supabase
            .from('admin_users')
            .select('*', { count: 'exact' });
          
          if (error) throw error;
          setHasAdmins(count !== null && count > 0);
        } catch (error) {
          console.error('Error checking admin users:', error);
        }
      };
      
      checkAdmins();
    }
  }, [user]);
  
  // If user is authenticated, redirect to game stats
  if (user && !isLoading && isAdmin) {
    return <Navigate to="/game-stats" replace />;
  }
  
  const makeAdmin = async () => {
    if (!user) return;
    
    setMakingAdmin(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .insert({ user_id: user.id });
      
      if (error) throw error;
      
      toast({
        title: "Admin privileges granted",
        description: "You now have admin privileges"
      });
      
      // Force reload to update the admin status
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to grant admin privileges"
      });
    } finally {
      setMakingAdmin(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Authentication</h1>
        <p className="text-muted-foreground mt-1">Login or sign up to manage game statistics</p>
      </header>
      
      {!user && (
        <div className="grid place-items-center py-8">
          <AuthForm />
        </div>
      )}
      
      {user && !isAdmin && (
        <div className="max-w-md mx-auto bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Account Information</h2>
              <p className="text-muted-foreground text-sm mt-1">
                You're logged in but don't have admin privileges.
              </p>
            </div>
            
            <div className="border rounded-md p-3 bg-muted/50">
              <div className="grid grid-cols-[auto_1fr] gap-2">
                <span className="font-medium">User ID:</span>
                <span className="text-sm break-all">{user.id}</span>
                <span className="font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            
            {!hasAdmins && (
              <div className="space-y-2">
                <p className="text-sm">
                  No admin users have been set up yet. As the first user, you can make yourself an admin:
                </p>
                <Button 
                  onClick={makeAdmin} 
                  className="w-full"
                  disabled={makingAdmin}
                >
                  {makingAdmin ? "Setting up admin..." : "Make me an admin"}
                </Button>
              </div>
            )}
            
            {hasAdmins && (
              <div className="bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 p-3 rounded text-sm">
                <p>There are already admin users in the system. Only existing admins can grant admin privileges.</p>
              </div>
            )}
            
            <div className="pt-2">
              <Button variant="outline" onClick={() => window.location.href = "/game-stats"} className="w-full">
                Continue to Game Stats
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
