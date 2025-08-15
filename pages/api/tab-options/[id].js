import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {

  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid tab ID',
    });
  }

  try {
    if (req.method === 'PUT') {
      // Update tab
      const { name, description } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Name is required'
        });
      }
      
      const { data, error } = await supabase
        .from('tab_options')
        .update({ 
          name: name.trim(), 
          description: description?.trim() || null
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Tab not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: data[0]
      });
      
    } else if (req.method === 'DELETE') {
      const { error: articleTabsError } = await supabase
        .from('article_tabs')
        .delete()
        .eq('tab_id', id);

      if (articleTabsError) {
        throw new Error(`Failed to delete associated tab articles for tab ID ${id}: ${articleTabsError.message}`);
      }

      const { error: tabError } = await supabase
        .from('tab_options')
        .delete()
        .eq('id', id);

      if (tabError) {
        throw new Error(`Failed to delete tab with ID ${id}: ${tabError.message}`);
      }

      return res.status(200).json({
        success: true,
        data: { message: `Tab ${id} and its associated articles deleted successfully.` },
      });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`
      });
    }
  } catch (error) {
    console.error('Error in tab-options/[id] API:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
}