// Helper to read raw body as string (for bodyParser: false)
async function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', err => {
      reject(err);
    });
  });
}
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

    const { userId, search, dateFrom, dateTo, minSize, maxSize } = req.query;
    let query = supabaseAdmin.from('documents').select('*');
    if (session.user.role !== 'admin') {

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
    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ documents: data });
  }

  // Bulk delete via POST with ?delete=1 for reliability
  if (req.method === 'POST' && req.query.delete === '1') {
    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    let ids = [];
    let body;
    try {
      const rawBody = await readBody(req);
      body = JSON.parse(rawBody);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    if (body && body.ids) {
      ids = body.ids;
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
      // Extract the full path after the bucket name in the public URL
      // Example: https://<project>.supabase.co/storage/v1/object/public/documents/user@email.com/filename.pdf
      let filePath = null;
      try {
        const url = doc.url;
        // Try to extract after '/documents/'
        const match = url.match(/\/documents\/(.+)$/);
        if (match && match[1]) {
          filePath = decodeURIComponent(match[1]);
        } else {
          // fallback: try to use the original fileName (may fail)
          filePath = decodeURIComponent(url.split('/').pop());
        }
        await supabaseAdmin.storage.from('documents').remove([filePath]);
      } catch (err) {
        // ignore
      }
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
