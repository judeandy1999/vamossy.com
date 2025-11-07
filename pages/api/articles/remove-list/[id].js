import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Update all articles that have this article_list_id to set it to null
    const { error } = await supabase
      .from('articles')
      .update({ article_list_id: null })
      .eq('article_list_id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Articles updated successfully' });
  } catch (error) {
    console.error('Error updating articles:', error);
    res.status(500).json({ error: 'Failed to update articles' });
  }
}