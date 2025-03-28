
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
          setTimeout(() => {
            // Use setTimeout to prevent potential auth deadlocks
            checkAdminStatus(session.user.id);
          }, 0);
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
      
      // Simplest approach: insert the admin user directly if it matches expected email
      if (user?.email === 'lukeggulasa@gmail.com') {
        console.log('Expected admin email detected, ensuring admin status');
        
        // Direct insert without using single() which can cause issues
        const { error: insertError } = await supabase
          .from('admin_users')
          .upsert({ user_id: userId });
        
        if (insertError) {
          console.error('Error setting admin status via direct insert:', insertError);
          
          // Try alternative approach with insert only
          const { error: altInsertError } = await supabase
            .from('admin_users')
            .insert({ user_id: userId })
            .select();
            
          if (altInsertError && !altInsertError.message.includes('duplicate')) {
            console.error('Error in alternative admin insert:', altInsertError);
            toast({
              title: "Admin Setup Error",
              description: "Could not set admin privileges. Please try logging out and back in.",
              variant: "destructive"
            });
          } else {
            console.log('Admin status fixed successfully (insert or already exists)');
            setIsAdmin(true);
          }
        } else {
          console.log('Admin status set successfully via upsert');
          setIsAdmin(true);
        }
        return;
      }
      
      // For non-admin emails, just check if they exist in the admin_users table
      const { data: adminUser, error: adminUserError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId);
      
      console.log('Admin user query result:', adminUser, adminUserError);
      
      if (adminUser && adminUser.length > 0) {
        console.log('User is an admin based on table query');
        setIsAdmin(true);
      } else {
        console.log('User is not an admin');
        setIsAdmin(false);
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
