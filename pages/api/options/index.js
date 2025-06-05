import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Fetch all options in a single query
    const { data: optionsData, error: optionsError } = await supabase
      .from('options')
      .select('id, value, type, category_id');

    if (optionsError) throw optionsError;

    // Split the data into wikiOptions and tabOptionsMap
    const wikiOptions = {};
    const tabOptionsMap = {};

    optionsData.forEach((item) => {
      if (item.type === 1) {
        // Wiki options
        wikiOptions[item.id] = item.value;
      } else if (item.type === 2) {
        // Tab options
        if (!tabOptionsMap[item.category_id]) {
          tabOptionsMap[item.category_id] = {};
        }
        const tabCount = Object.keys(tabOptionsMap[item.category_id]).length + 1;
        tabOptionsMap[item.category_id][tabCount] = item.value;
      }
    });

    // Respond with both options
    return res.status(200).json({ wikiOptions, tabOptionsMap });
  } catch (error) {
    console.error('Error fetching options:', error.message);
    return res.status(500).json({ error: 'Failed to fetch options' });
  }
}