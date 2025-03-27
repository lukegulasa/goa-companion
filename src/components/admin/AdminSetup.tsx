
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_EMAIL = 'lukeggulasa@gmail.com';
const ADMIN_PASSWORD = 'goa123';
const ADMIN_NAME = 'luke';

const AdminSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    checkForAdmin();
  }, []);
  
  const checkForAdmin = async () => {
    try {
      const { data, error } = await supabase.rpc('check_admin_count');
      
      if (error) {
        console.error('Error checking admin count:', error);
        return;
      }
      
      setAdminExists(data > 0);
      setShowDialog(data === 0);
    } catch (error) {
      console.error('Error in checkForAdmin:', error);
    }
  };
  
  const handleSetupAdmin = async () => {
    setLoading(true);
    
    try {
      const result = await setupAdminUser(
        ADMIN_EMAIL,
        ADMIN_PASSWORD,
        ADMIN_NAME
      );
      
      if (result.success) {
        toast({
          title: "Admin account created",
          description: `Admin account for ${ADMIN_EMAIL} was created successfully`
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
            </div>
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
