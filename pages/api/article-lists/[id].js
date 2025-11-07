import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;
  
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Valid ID is required' });
  }

  try {
    if (req.method === 'PUT') {
      const { name, description } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const { data, error } = await supabase
        .from('article_lists')
        .update({ 
          name: name.trim(), 
          description: description?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data.length === 0) {
        return res.status(404).json({ error: 'Article list not found' });
      }
      
      return res.status(200).json(data[0]);
      
    } else if (req.method === 'DELETE') {
      // Check if any articles are using this article list
      const { count: articleCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('article_list_id', id);
        
      if (articleCount > 0) {
        return res.status(400).json({ 
          error: `Cannot delete article list. ${articleCount} articles are using this list.` 
        });
      }
      
      const { error } = await supabase
        .from('article_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return res.status(200).json({ message: `Article list ${id} deleted successfully.` });
      
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Article list API error:', error);
    return res.status(500).json({ error: error.message });
  }
}