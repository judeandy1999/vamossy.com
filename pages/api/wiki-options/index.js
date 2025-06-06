import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';


export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  try {
    if (req.method === 'GET') {

      const { data, error } = await supabase.from('wiki_options').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    } else if (req.method === 'POST') {

      const { name, description } = req.body;
      const { data, error } = await supabase
        .from('wiki_options')
        .insert([{ name, description }])
        .select();
      if (error) throw error;
      return res.status(201).json(data);
    } else if (req.method === 'PUT') {

      const { id, name, description } = req.body;
      const { data, error } = await supabase
        .from('wiki_options')
        .update({ name, description })
        .eq('id', id)
        .select();
      if (error) throw error;
      return res.status(200).json(data);
    } else if (req.method === 'DELETE') {

      const { id } = req.body;
      const { error } = await supabase.from('wiki_options').delete().eq('id', id);
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