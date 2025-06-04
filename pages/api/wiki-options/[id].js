import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Delete all tabs associated with the wiki
      const { error: tabError } = await supabase
        .from('tab_options')
        .delete()
        .eq('wiki_id', id);

      if (tabError) {
        throw new Error(`Failed to delete tabs for wiki ${id}: ${tabError.message}`);
      }

      // Delete the wiki
      const { error: wikiError } = await supabase
        .from('wiki_options')
        .delete()
        .eq('id', id);

      if (wikiError) {
        throw new Error(`Failed to delete wiki ${id}: ${wikiError.message}`);
      }

      res.status(200).json({ message: `Wiki ${id} and its associated tabs were deleted successfully.` });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}