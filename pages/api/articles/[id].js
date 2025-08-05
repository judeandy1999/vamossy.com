import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  const { id } = req.query;

  if (req.method !== 'GET') {
    const { error } = await verifySupabaseAuth(req);
    if (error) {
      return res.status(401).json({ error });
    }
  }

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
    const { title, content, wiki_id, has_tabs, user_email } = req.body;
    // Note: No tabs in this request anymore

    try {
      const { data: article, error: updateError } = await supabase
        .from('articles')
        .update({ 
          title, 
          content: has_tabs ? '' : content,
          wiki_id, 
          has_tabs,
          user_email,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update article: ${updateError.message}`);
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error('Article update error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Delete associated tabs first
      await supabase
        .from('article_tabs')
        .delete()
        .eq('article_id', id);

      // Then delete the article
      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(`Failed to delete article: ${deleteError.message}`);
      }

      return res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
      console.error('Article deletion error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
