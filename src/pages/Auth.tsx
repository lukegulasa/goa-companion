import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth: React.FC = () => {
  const [email, setEmail] = useState('lukeggulasa@gmail.com'); // Pre-fill with admin email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check for email confirmation success
  useEffect(() => {
    // Extract hash fragment from URL
    const hash = location.hash;
    if (hash && hash.includes('access_token')) {
      // This means the user has successfully confirmed their email
      setConfirmationSuccess(true);
      
      // Clear the hash to prevent reprocessing on refresh
      window.history.replaceState(null, '', location.pathname);
      
      // Show a success message
      toast({
        title: "Email confirmed",
        description: "Your email has been confirmed. You can now log in."
      });
    }
  }, [location, toast]);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      if (session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session) {
          navigate('/');
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    try {
      console.log(`Attempting login with: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        setErrorMsg(error.message);
        
        // Show more helpful message for common errors
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. If you recently created your account, please check your email and confirm your account first.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and follow the confirmation link before logging in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message || "Invalid login credentials",
            variant: "destructive"
          });
        }
        return;
      }
      
      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        
        // Set admin status using RPC function instead of direct table access
        try {
          console.log('Checking admin status during login');
          const { data: isAdmin, error: adminError } = await supabase
            .rpc('is_admin', { user_id: data.user.id });
            
          if (adminError) {
            console.error('Error checking admin status during login:', adminError);
          } else {
            console.log('Admin status during login:', isAdmin);
            if (!isAdmin && data.user.email === 'lukeggulasa@gmail.com') {
              // Expected admin email but not in admin table - try to add
              console.log('Adding expected admin to admin_users table');
              const { error: insertError } = await supabase
                .from('admin_users')
                .insert({ user_id: data.user.id });
                
              if (insertError) {
                console.error('Error setting admin privileges:', insertError);
                toast({
                  title: "Warning",
                  description: "Could not set admin privileges. Please contact support.",
                  variant: "destructive"
                });
              }
            }
          }
        } catch (err) {
          console.error('Error managing admin status:', err);
        }
        
        toast({
          title: "Login successful",
          description: "You are now logged in"
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Unexpected error during login:', error);
      setErrorMsg(error.message || "An unexpected error occurred");
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-8">
      {confirmationSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>
            Your email has been confirmed successfully. You can now log in.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in to access administrator features
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
