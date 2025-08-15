import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {

  const { id } = req.query;
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Valid ID is required' });
  }

  try {
    if (req.method === 'PUT') {
      // Update main category
      const { name, description } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const { data, error } = await supabase
        .from('main_categories')
        .update({ name: name.trim(), description: description?.trim() || null })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data.length === 0) {
        return res.status(404).json({ error: 'Main category not found' });
      }
      
      return res.status(200).json(data);
      
    } else if (req.method === 'DELETE') {
      // Delete main category
      // First, unassign all categories from this main category
      const { error: updateError } = await supabase
        .from('category_options')
        .update({ main_category_id: null })
        .eq('main_category_id', id);
      
      if (updateError) throw updateError;
      
      // Then delete the main category
      const { error } = await supabase
        .from('main_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return res.status(204).end();
      
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in main-categories/[id] API:', error.message);
    return res.status(500).json({ error: error.message });
  }
}