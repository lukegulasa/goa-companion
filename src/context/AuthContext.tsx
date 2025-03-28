
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user is set, check if they're an admin
        if (session?.user) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // First, let's check if this user exists in the admin_users table
      const { data: adminUser, error: adminUserError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      console.log('Admin user check result:', adminUser, adminUserError);
      
      // Now let's check the RPC function result
      const { data: isAdminResult, error } = await supabase.rpc('is_admin', { user_id: userId });
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      console.log('Admin status result:', isAdminResult);
      setIsAdmin(isAdminResult || false);
      
      // If not an admin, but should be, let's try to add them as admin
      if (!isAdminResult && userId) {
        // This is the email we expect for the admin
        const userEmail = user?.email;
        console.log('Current user email:', userEmail);
        
        if (userEmail === 'lukeggulasa@gmail.com') {
          console.log('Attempting to fix admin status for expected admin user');
          const { error: insertError } = await supabase
            .from('admin_users')
            .upsert({ user_id: userId })
            .select();
          
          if (insertError) {
            console.error('Error fixing admin status:', insertError);
            toast({
              title: "Admin Setup Error",
              description: "Could not set admin privileges. Please contact support.",
              variant: "destructive"
            });
          } else {
            console.log('Admin status fixed successfully');
            setIsAdmin(true);
            toast({
              title: "Admin Privileges Granted",
              description: "You now have admin access to the application."
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    }
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };
  
  return (
    <AuthContext.Provider value={{ session, user, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
