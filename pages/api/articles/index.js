import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { page = '1', limit = '5' } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const from = (pageNumber - 1) * limitNumber;
  const to = from + limitNumber - 1;

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  return res.status(200).json(data);
}
