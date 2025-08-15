import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Valid category ID is required' });
  }

  try {
    if (req.method === 'PUT') {
      // Update category's main category assignment
      const { main_category_id } = req.body;
      
      const { data, error } = await supabase
        .from('category_options')
        .update({ main_category_id: main_category_id || null })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.status(200).json(data[0]);
      
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error updating category main category:', error.message);
    return res.status(500).json({ error: error.message });
  }
}