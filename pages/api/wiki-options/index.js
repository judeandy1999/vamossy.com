import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all categories with their main category info
      const { data, error } = await supabase
        .from('category_options')
        .select(`
          *,
          main_categories (
            id,
            name,
            description
          )
        `);
      if (error) throw error;
      return res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      // Create new category
      const { name, description, main_category_id } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const { data, error } = await supabase
        .from('category_options')
        .insert([{ 
          name: name.trim(), 
          description: description?.trim() || null,
          main_category_id: main_category_id || null
        }])
        .select();
      if (error) throw error;
      return res.status(201).json(data);
      
    } else if (req.method === 'PUT') {
      // Update category
      const { id, name, description, main_category_id } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const { data, error } = await supabase
        .from('category_options')
        .update({ 
          name: name.trim(), 
          description: description?.trim() || null,
          main_category_id: main_category_id || null
        })
        .eq('id', id)
        .select();
      if (error) throw error;
      return res.status(200).json(data);
      
    } else if (req.method === 'DELETE') {
      // Delete category
      const { id } = req.body;
      const { error } = await supabase.from('category_options').delete().eq('id', id);
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