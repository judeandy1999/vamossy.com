import { getSession } from '../../../lib/authMiddleware';
import { supabaseAdmin } from '../../../utils/storageClient';

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }



  if (req.method === 'GET') {
    // List documents (admin: all, user: own)
    // Filters: userId, search, dateFrom, dateTo, minSize, maxSize
    const { userId, search, dateFrom, dateTo, minSize, maxSize } = req.query;
    let query = supabaseAdmin.from('documents').select('*');
    if (session.user.role !== 'admin') {
      // Users can only see their own documents
      query = query.contains('assigned_users', [session.user.id]);
    } else if (userId) {
      query = query.contains('assigned_users', [userId]);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }
    if (minSize) {
      query = query.gte('size', Number(minSize));
    }
    if (maxSize) {
      query = query.lte('size', Number(maxSize));
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ documents: data });
  }

  if (req.method === 'DELETE') {
    // Bulk delete (admin only)
    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    let ids = [];
    if (req.body && req.body.ids) {
      ids = req.body.ids;
    } else if (req.query.ids) {
      ids = Array.isArray(req.query.ids) ? req.query.ids : [req.query.ids];
    }
    if (!ids.length) {
      return res.status(400).json({ error: 'No document IDs provided' });
    }
    // Get docs to delete
    const { data: docs, error: fetchError } = await supabaseAdmin.from('documents').select('*').in('id', ids);
    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }
    // Delete from storage
    for (const doc of docs) {
      const fileName = doc.url.split('/').pop();
      await supabaseAdmin.storage.from('documents').remove([fileName]);
    }
    // Delete from DB
    const { error: delError } = await supabaseAdmin.from('documents').delete().in('id', ids);
    if (delError) {
      return res.status(500).json({ error: delError.message });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
