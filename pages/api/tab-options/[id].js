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

  if (req.method === 'DELETE') {
    try {
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
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        details: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  }
}