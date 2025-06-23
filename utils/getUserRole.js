import { supabase } from '@/utils/client';

export async function getUserRole(userEmail) {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', userEmail)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return 'worker';
    }
    
    return userData?.role || 'worker';
  } catch (err) {
    console.error('Error fetching user role:', err);
    return 'worker';
  }
}

export async function getUserRoleById(userId) {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role by ID:', error);
      return 'worker';
    }
    
    return userData?.role || 'worker';
  } catch (err) {
    console.error('Error fetching user role by ID:', err);
    return 'worker';
  }
}