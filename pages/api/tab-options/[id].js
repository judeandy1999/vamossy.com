import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('tab_options')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete tab with ID ${id}: ${error.message}`);
      }

      res.status(200).json({ message: `Tab ${id} deleted successfully.` });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}