// /pages/api/articles/[id].js
import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  const { id } = req.query;
  const full = req.query.full === 'true';

  if (req.method === 'GET') {
    try {
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .select(full ? '*' : 'id, title, created_at, has_tabs')
        .eq('id', id)
        .single();

      if (articleError) {
        throw new Error(`Failed to fetch article: ${articleError.message}`);
      }

      if (full && article.has_tabs) {
        const { data: tabsWithNames, error: tabsWithNamesError } = await supabase
          .from('article_tabs')
          .select('tab_id, content, tab_options(name)')
          .eq('article_id', id);

        if (tabsWithNamesError) {
          throw new Error(`Failed to fetch tabs with names: ${tabsWithNamesError.message}`);
        }

        article.tabs = tabsWithNames.reduce((acc, tab) => {
          acc[tab.tab_id] = {
            content: tab.content,
            name: tab.tab_options?.name || `Tab ${tab.tab_id}`,
          };
          return acc;
        }, {});
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const { title, content, wiki_id, has_tabs, tabs } = req.body;

    try {
      // Update the article in the `articles` table
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .update({ title, content, wiki_id, has_tabs })
        .eq('id', id)
        .select()
        .single();

      if (articleError) {
        throw new Error(`Failed to update article: ${articleError.message}`);
      }

      // If the article has tabs, update the `article_tabs` table
      if (has_tabs && tabs && Object.keys(tabs).length > 0) {
        // Delete existing tabs for the article
        const { error: deleteError } = await supabase
          .from('article_tabs')
          .delete()
          .eq('article_id', id);

        if (deleteError) {
          throw new Error(`Failed to delete existing tabs: ${deleteError.message}`);
        }

        // Insert updated tabs
        const tabEntries = Object.entries(tabs).map(([tabId, tabContent]) => ({
          article_id: id,
          tab_id: Number(tabId),
          content: tabContent,
        }));

        const { error: tabsError } = await supabase
          .from('article_tabs')
          .insert(tabEntries);

        if (tabsError) {
          throw new Error(`Failed to update article tabs: ${tabsError.message}`);
        }
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error: tabArticlesError } = await supabase
        .from('article_tabs')
        .delete()
        .eq('article_id', id);

      if (tabArticlesError) {
        throw new Error(`Failed to delete associated tab articles: ${tabArticlesError.message}`);
      }

      const { error: articleError } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (articleError) {
        throw new Error(`Failed to delete article: ${articleError.message}`);
      }

      return res.status(200).json({ message: 'Article and associated tab articles deleted successfully' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
