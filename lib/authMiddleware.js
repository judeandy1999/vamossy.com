
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export function authenticate(req, res) {
  const internalHeader = req.headers['x-internal-request'];
  if (!internalHeader || internalHeader !== process.env.INTERNAL_API_KEY) {
    res.status(403).json({ error: 'Forbidden: You have no access, Access is not allowed' });
    return false;
  }
  return true;
}

export async function getSession(req, res) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  // Validate JWT and get user info
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) {
    return null;
  }
  // Optionally fetch user role from your users table
  let role = 'user';
  try {
    const { data: userData } = await supabase.from('users').select('role').eq('id', data.user.id).single();
    if (userData && userData.role) role = userData.role;
  } catch {}
  return { user: { id: data.user.id, role } };
}