import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data: tabs, error } = await supabase
        .from('article_tabs')
        .select('tab_id, content')
        .eq('article_id', id);

      if (error) {
        throw new Error(`Failed to fetch tabs for article ${id}: ${error.message}`);
      }

      res.status(200).json(tabs);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}