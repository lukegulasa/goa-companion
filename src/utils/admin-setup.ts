
import { supabase } from '@/integrations/supabase/client';

export const setupAdminUser = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    console.log('Setting up admin user...');
    // Check if any admins exist
    const { data: adminCount, error: countError } = await supabase.rpc('check_admin_count');
    
    if (countError) {
      console.error('Error checking admin count:', countError);
      return { success: false, error: countError.message };
    }
    
    console.log('Current admin count:', adminCount);
    
    // If admins already exist, prevent creation of new one
    if (adminCount > 0) {
      console.log('An admin user already exists');
      return { success: false, error: 'An admin user already exists' };
    }
    
    // Sign up the user
    console.log('Creating user account...');
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (signupError) {
      console.error('Error creating user:', signupError);
      return { success: false, error: signupError.message };
    }
    
    console.log('User account created:', authData);
    
    // If user was created successfully, add them to admin_users table
    if (authData.user) {
      console.log('Adding user to admin_users table...');
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([{ user_id: authData.user.id }]);
      
      if (adminError) {
        console.error('Error setting user as admin:', adminError);
        return { success: false, error: adminError.message };
      }
      
      console.log('Admin user setup complete');
      
      // Try to sign in immediately to confirm the account works
      try {
        console.log('Testing login with new credentials...');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.warn('Note: New admin could not be signed in automatically:', signInError);
          // Don't return error here as the account was still created
        } else {
          console.log('Auto sign-in successful');
        }
      } catch (signInErr) {
        console.warn('Error during auto sign-in test:', signInErr);
        // Don't fail the overall operation, just log the warning
      }
      
      return { success: true, user: authData.user };
    } else {
      return { success: false, error: 'User was not created' };
    }
  } catch (error: any) {
    console.error('Unexpected error in setupAdminUser:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};
