import { supabase } from '@/utils/client';

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const { title, content, wiki_id, has_tabs, user_email, article_list_id } = req.body; // Add article_list_id

    try {
      // First, create the article with article_list_id
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert([{ 
          title, 
          content: has_tabs ? '' : content,
          has_tabs, 
          user_email,
          article_list_id: article_list_id || null // Add this line
        }])
        .select()
        .single();

      if (articleError) {
        throw new Error(`Failed to create article: ${articleError.message}`);
      }

      // Then, create the article-wiki relationships
      if (wiki_id && Array.isArray(wiki_id) && wiki_id.length > 0) {
        const articleWikiInserts = wiki_id.map(wikiId => ({
          article_id: article.id,
          wiki_id: wikiId
        }));

        const { error: relationError } = await supabase
          .from('article_wiki')
          .insert(articleWikiInserts);

        if (relationError) {
          // Rollback: delete the article if wiki relationships fail
          await supabase.from('articles').delete().eq('id', article.id);
          throw new Error(`Failed to create article-wiki relationships: ${relationError.message}`);
        }
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error('Article creation error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
