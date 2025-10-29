import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { title, content, wiki_id, has_tabs, user_email } = req.body;

    try {
      // Update the article
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .update({ 
          title, 
          content: has_tabs ? '' : content,
          has_tabs, 
          user_email 
        })
        .eq('id', id)
        .select()
        .single();

      if (articleError) {
        throw new Error(`Failed to update article: ${articleError.message}`);
      }

      // Update wiki relationships - delete existing and insert new ones
      if (wiki_id && Array.isArray(wiki_id)) {
        // Delete existing relationships
        const { error: deleteError } = await supabase
          .from('article_wiki')
          .delete()
          .eq('article_id', id);

        if (deleteError) {
          throw new Error(`Failed to delete existing wiki relationships: ${deleteError.message}`);
        }

        // Insert new relationships
        if (wiki_id.length > 0) {
          const articleWikiInserts = wiki_id.map(wikiId => ({
            article_id: parseInt(id),
            wiki_id: wikiId
          }));

          const { error: insertError } = await supabase
            .from('article_wiki')
            .insert(articleWikiInserts);

          if (insertError) {
            throw new Error(`Failed to create new wiki relationships: ${insertError.message}`);
          }
        }
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
