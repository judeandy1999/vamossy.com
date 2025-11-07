import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('article_lists')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      const { name, description } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const { data, error } = await supabase
        .from('article_lists')
        .insert([{ 
          name: name.trim(), 
          description: description?.trim() || null 
        }])
        .select();
        
      if (error) throw error;
      return res.status(201).json(data);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Article lists API error:', error);
    return res.status(500).json({ error: error.message });
  }
}