import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';
import { getUserRole } from '@/utils/getUserRole';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filter = 'all', sortBy = 'created_at' } = req.query;
    
    // Get user role
    const userRole = await getUserRole(user.email);

    // Calculate date filter
    let dateFilter = null;
    const now = new Date();
    
    switch (filter) {
      case 'daily':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = weekAgo;
        break;
      case 'monthly':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = monthAgo;
        break;
      default:
        dateFilter = null;
    }

    let query = supabase
      .from('evaluations')
      .select(`
        *,
        tasks (id, title, description),
        task_logs (id, log_content, file_url),
        users (id, email, name, role)
      `);

    if (userRole !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    if (dateFilter) {
      query = query.gte('created_at', dateFilter.toISOString());
    }

    query = query.order(sortBy, { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return res.status(200).json({ evaluations: data || [] });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
}