
import { supabase } from '@/integrations/supabase/client';

export const setupAdminUser = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    // Check if any admins exist
    const { data: adminCount, error: countError } = await supabase.rpc('check_admin_count');
    
    if (countError) {
      console.error('Error checking admin count:', countError);
      return { success: false, error: countError.message };
    }
    
    // If admins already exist, prevent creation of new one
    if (adminCount > 0) {
      console.log('An admin user already exists');
      return { success: false, error: 'An admin user already exists' };
    }
    
    // Sign up the user
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
    
    // If user was created successfully, add them to admin_users table
    if (authData.user) {
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([{ user_id: authData.user.id }]);
      
      if (adminError) {
        console.error('Error setting user as admin:', adminError);
        return { success: false, error: adminError.message };
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
