import { supabase } from '@/utils/client';

export async function verifySupabaseAuth(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return { user: null, error: 'Unauthorized (no token)' };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: 'Unauthorized' };
  }

  return { user, error: null };
}
