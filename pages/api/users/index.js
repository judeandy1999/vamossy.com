import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, error: authError } = await verifySupabaseAuth(req);
    if (authError) {
      return res.status(401).json({ error: authError });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar_url')
      .order('email');

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      users: data || []
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
}