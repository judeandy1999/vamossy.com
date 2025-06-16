import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;
  
  const { user, error } = await verifySupabaseAuth(req);
  if (error) {
    return res.status(401).json({ error });
  }

  if (req.method === 'DELETE') {
    const { articleId } = req.query;

    try {
      const { error: deleteError } = await supabase
        .from('article_tabs')
        .delete()
        .eq('article_id', Number(articleId));

      if (deleteError) {
        throw new Error(`Failed to delete tabs: ${deleteError.message}`);
      }

      return res.status(200).json({ message: 'All tabs deleted successfully' });
    } catch (error) {
      console.error('Tab deletion error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}