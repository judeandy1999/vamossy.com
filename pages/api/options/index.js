import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { data: wikiData, error: wikiError } = await supabase
      .from('options')
      .select('id, value')
      .eq('type', 1);

    if (wikiError) throw wikiError;

    const wikiOptions = wikiData.reduce((acc, item) => {
      acc[item.id] = item.value;
      return acc;
    }, {});

    // Fetch tab options
    const { data: tabData, error: tabError } = await supabase
      .from('options')
      .select('category_id, value')
      .eq('type', 2);

    if (tabError) throw tabError;

    const tabOptionsMap = tabData.reduce((acc, item) => {
      if (!acc[item.category_id]) acc[item.category_id] = {};
      const tabCount = Object.keys(acc[item.category_id]).length + 1;
      acc[item.category_id][tabCount] = item.value;
      return acc;
    }, {});

    // Respond with both options
    res.status(200).json({ wikiOptions, tabOptionsMap });
  } catch (error) {
    console.error('Error fetching options:', error.message);
    res.status(500).json({ error: 'Failed to fetch options' });
  }
}