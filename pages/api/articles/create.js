import { supabase } from '@/utils/client';

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const { title, content, wiki_id, has_tabs, user_email } = req.body;
    // Note: No tabs in this request anymore

    try {
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert([{ 
          title, 
          content: has_tabs ? '' : content,
          wiki_id, 
          has_tabs, 
          user_email 
        }])
        .select()
        .single();

      if (articleError) {
        throw new Error(`Failed to create article: ${articleError.message}`);
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
