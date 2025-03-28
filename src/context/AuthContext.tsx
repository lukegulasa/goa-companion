
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
      
      // Direct query approach - no need for the special upsert for the expected admin email
      const { data: adminUser, error: adminUserError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId);
      
      if (adminUserError) {
        console.error('Error checking admin status:', adminUserError);
        
        // Fall back to RPC function if direct query fails
        const { data: isAdminResult, error: rpcError } = await supabase
          .rpc('is_admin', { user_id: userId });
          
        if (rpcError) {
          console.error('Error in RPC admin check:', rpcError);
          setIsAdmin(false);
        } else {
          console.log('Admin status from RPC:', isAdminResult);
          setIsAdmin(!!isAdminResult);
        }
        return;
      }
      
      console.log('Admin user query result:', adminUser);
      
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
