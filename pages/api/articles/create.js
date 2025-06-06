import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method === 'POST') {
    const { title, content, wiki_id, has_tabs, tabs } = req.body;

    try {
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert([{ title, content, wiki_id, has_tabs }])
        .select()
        .single();

      if (articleError) {
        throw new Error(`Failed to create article: ${articleError.message}`);
      }

      if (has_tabs && tabs && Object.keys(tabs).length > 0) {
        const tabEntries = Object.entries(tabs).map(([tabId, tabContent]) => ({
          article_id: article.id,
          tab_id: Number(tabId),
          content: tabContent,
        }));

        const { error: tabsError } = await supabase
          .from('article_tabs')
          .insert(tabEntries);

        if (tabsError) {
          throw new Error(`Failed to create article tabs: ${tabsError.message}`);
        }
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
