import { supabase } from '@/utils/client';

export async function verifySupabaseAuth(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return { success: false, user: null, error: 'Unauthorized (no token)' };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { success: false, user: null, error: 'Unauthorized' };
    }

    return { success: true, user, error: null };
  } catch (err) {
    return { success: false, user: null, error: 'Unauthorized' };
  }
}
