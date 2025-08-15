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
      // Update category
      const { name, description, main_category_id } = req.body;
      
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
      
      if (data.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.status(200).json(data[0]);
      
    } else if (req.method === 'DELETE') {
      // Step 1: Delete all articles that directly reference this wiki (via wiki_id)
      const { error: directArticlesError } = await supabase
        .from('articles')
        .delete()
        .eq('wiki_id', id);

      if (directArticlesError) {
        throw new Error(`Failed to delete articles directly associated with wiki ${id}: ${directArticlesError.message}`);
      }

      // Step 2: Fetch all tab IDs associated with the wiki
      const { data: tabs, error: fetchTabsError } = await supabase
        .from('tab_options')
        .select('id')
        .eq('wiki_id', id);

      if (fetchTabsError) {
        throw new Error(`Failed to fetch tabs for wiki ${id}: ${fetchTabsError.message}`);
      }

      const tabIds = tabs.map((tab) => tab.id);

      // Step 3: Delete all article_tabs entries for these tabs
      if (tabIds.length > 0) {
        const { error: articleTabsError } = await supabase
          .from('article_tabs')
          .delete()
          .in('tab_id', tabIds);

        if (articleTabsError) {
          throw new Error(`Failed to delete article tabs for wiki ${id}: ${articleTabsError.message}`);
        }
      }

      // Step 4: Delete all tabs associated with the wiki
      const { error: tabError } = await supabase
        .from('tab_options')
        .delete()
        .eq('wiki_id', id);

      if (tabError) {
        throw new Error(`Failed to delete tabs for wiki ${id}: ${tabError.message}`);
      }

      // Step 5: Finally delete the wiki
      const { error: wikiError } = await supabase
        .from('category_options')
        .delete()
        .eq('id', id);

      if (wikiError) {
        throw new Error(`Failed to delete wiki ${id}: ${wikiError.message}`);
      }

      return res.status(200).json({ message: `Wiki ${id}, its associated tabs, and articles were deleted successfully.` });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error in wiki-options/[id] API:', error.message);
    return res.status(500).json({ error: error.message });
  }
}