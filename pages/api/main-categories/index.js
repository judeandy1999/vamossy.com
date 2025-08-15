import { supabase } from '@/utils/client';

export default async function handler(req, res) {

  try {
    if (req.method === 'GET') {
      // Get all main categories
      const { data, error } = await supabase
        .from('main_categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      // Create new main category
      const { name, description } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const { data, error } = await supabase
        .from('main_categories')
        .insert([{ name: name.trim(), description: description?.trim() || null }])
        .select();
      
      if (error) throw error;
      return res.status(201).json(data);
      
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in main-categories API:', error.message);
    return res.status(500).json({ error: error.message });
  }
}