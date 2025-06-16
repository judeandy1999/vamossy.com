import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;
  
  const { user, error } = await verifySupabaseAuth(req);
  if (error) {
    return res.status(401).json({ error });
  }

  if (req.method === 'POST') {
    const { article_id, tab_id, content } = req.body;

    try {
      const { data: tab, error: tabError } = await supabase
        .from('article_tabs')
        .insert([{
          article_id: Number(article_id),
          tab_id: Number(tab_id),
          content: content,
        }])
        .select()
        .single();

      if (tabError) {
        throw new Error(`Failed to create tab: ${tabError.message}`);
      }

      return res.status(200).json(tab);
    } catch (error) {
      console.error('Tab creation error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}