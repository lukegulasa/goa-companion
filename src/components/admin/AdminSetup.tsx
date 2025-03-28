
import React, { useState, useEffect } from 'react';
import { setupAdminUser } from '@/utils/admin-setup';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// These should exactly match what you specified
const ADMIN_EMAIL = 'lukeggulasa@gmail.com';
const ADMIN_PASSWORD = 'goa123';
const ADMIN_NAME = 'luke';

const AdminSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [adminExists, setAdminExists] = useState(true); // Default to true to prevent flashing
  const { toast } = useToast();
  
  useEffect(() => {
    checkForAdmin();
  }, []);
  
  const checkForAdmin = async () => {
    try {
      console.log('Checking for existing admin users...');
      
      // First check if the current user is an admin
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .limit(1);
          
        console.log('Admin data from direct query:', adminData);
        
        if (adminData && adminData.length > 0) {
          console.log('Admin already exists, not showing setup dialog');
          setAdminExists(true);
          setShowDialog(false);
          return;
        }
      }
      
      // Fall back to the RPC function as a secondary check
      const { data, error } = await supabase.rpc('check_admin_count');
      
      if (error) {
        console.error('Error checking admin count:', error);
        return;
      }
      
      console.log('Admin count from RPC:', data);
      setAdminExists(data > 0);
      
      // Only show the dialog if no admin exists
      if (data === 0) {
        console.log('No admin exists, showing setup dialog');
        setShowDialog(true);
      } else {
        console.log('Admin already exists, not showing setup dialog');
      }
    } catch (error) {
      console.error('Error in checkForAdmin:', error);
    }
  };
  
  const handleSetupAdmin = async () => {
    setLoading(true);
    
    try {
      console.log('Setting up admin account with:', ADMIN_EMAIL);
      const result = await setupAdminUser(
        ADMIN_EMAIL,
        ADMIN_PASSWORD,
        ADMIN_NAME
      );
      
      console.log('Setup admin result:', result);
      
      if (result.success) {
        toast({
          title: "Admin account created",
          description: result.message || `Admin account for ${ADMIN_EMAIL} was created. Please check your email to confirm your account before logging in.`
        });
        setShowDialog(false);
        setAdminExists(true);
      } else {
        toast({
          title: "Failed to create admin",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error in handleSetupAdmin:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Admin Account</DialogTitle>
            <DialogDescription>
              Create the admin account for managing game statistics
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              An admin account will be created with the following details:
            </p>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm col-span-2">{ADMIN_NAME}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm col-span-2">{ADMIN_EMAIL}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Password:</span>
                <span className="text-sm col-span-2">••••••••</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              You'll need to confirm your email address before logging in.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleSetupAdmin} 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Admin Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSetup;
