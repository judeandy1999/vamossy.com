// /pages/api/articles/[id].js
import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { id } = req.query;
  const { full } = req.query;

  const { data, error } = await supabase
    .from('articles')
    .select(full === 'true'
      ? 'id, title, preview, created_at, content'
      : 'id, title, preview, created_at'
    )
    .eq('id', id)
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
}
