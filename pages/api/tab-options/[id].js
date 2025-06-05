import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Delete associated tab articles from the `article_tabs` table
      const { error: articleTabsError } = await supabase
        .from('article_tabs')
        .delete()
        .eq('tab_id', id);

      if (articleTabsError) {
        throw new Error(`Failed to delete associated tab articles for tab ID ${id}: ${articleTabsError.message}`);
      }

      // Delete the tab from the `tab_options` table
      const { error: tabError } = await supabase
        .from('tab_options')
        .delete()
        .eq('id', id);

      if (tabError) {
        throw new Error(`Failed to delete tab with ID ${id}: ${tabError.message}`);
      }

      return res.status(200).json({ message: `Tab ${id} and its associated articles deleted successfully.` });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}