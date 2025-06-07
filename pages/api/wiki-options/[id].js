import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;
  if (req.method !== 'GET') {
    const { user, error } = await verifySupabaseAuth(req);

    if (error) {
      return res.status(401).json({ error });
    }
  }
  
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Step 1: Fetch all tab IDs associated with the wiki
      const { data: tabs, error: fetchTabsError } = await supabase
        .from('tab_options')
        .select('id')
        .eq('wiki_id', id);

      if (fetchTabsError) {
        throw new Error(`Failed to fetch tabs for wiki ${id}: ${fetchTabsError.message}`);
      }

      const tabIds = tabs.map((tab) => tab.id);

      // Step 2: Fetch all article IDs associated with the tabs
      let articleIds = [];
      if (tabIds.length > 0) {
        const { data: articles, error: fetchArticlesError } = await supabase
          .from('article_tabs')
          .select('article_id')
          .in('tab_id', tabIds);

        if (fetchArticlesError) {
          throw new Error(`Failed to fetch articles associated with tabs for wiki ${id}: ${fetchArticlesError.message}`);
        }

        articleIds = articles.map((article) => article.article_id);
      }

      // Step 3: Delete all articles associated with the tabs
      if (articleIds.length > 0) {
        const { error: articlesError } = await supabase
          .from('articles')
          .delete()
          .in('id', articleIds);

        if (articlesError) {
          throw new Error(`Failed to delete articles for wiki ${id}: ${articlesError.message}`);
        }
      }

      // Step 4: Delete all articles associated with the tabs in `article_tabs`
      if (tabIds.length > 0) {
        const { error: articleTabsError } = await supabase
          .from('article_tabs')
          .delete()
          .in('tab_id', tabIds);

        if (articleTabsError) {
          throw new Error(`Failed to delete articles associated with tabs for wiki ${id}: ${articleTabsError.message}`);
        }
      }

      // Step 5: Delete all tabs associated with the wiki
      const { error: tabError } = await supabase
        .from('tab_options')
        .delete()
        .eq('wiki_id', id);

      if (tabError) {
        throw new Error(`Failed to delete tabs for wiki ${id}: ${tabError.message}`);
      }

      // Step 6: Delete the wiki
      const { error: wikiError } = await supabase
        .from('wiki_options')
        .delete()
        .eq('id', id);

      if (wikiError) {
        throw new Error(`Failed to delete wiki ${id}: ${wikiError.message}`);
      }

      return res.status(200).json({ message: `Wiki ${id}, its associated tabs, and articles were deleted successfully.` });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}