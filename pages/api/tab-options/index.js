import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { wiki_id } = req.query;

      const query = supabase.from('tab_options').select('*');
      if (wiki_id) {
        query.eq('wiki_id', wiki_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const { wiki_id, name, description } = req.body;
      const { data, error } = await supabase
        .from('tab_options')
        .insert([{ wiki_id, name, description }])
        .select();
      if (error) throw error;

      return res.status(201).json(data);
    } else if (req.method === 'PUT') {
      const { id, name, description } = req.body;
      const { data, error } = await supabase
        .from('tab_options')
        .update({ name, description })
        .eq('id', id)
        .select();
      if (error) throw error;

      return res.status(200).json(data);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('tab_options').delete().eq('id', id);
      if (error) throw error;

      return res.status(204).end();
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}