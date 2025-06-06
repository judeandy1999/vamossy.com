import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { data: optionsData, error: optionsError } = await supabase
      .from('options')
      .select('id, value, type, category_id');

    if (optionsError) throw optionsError;

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

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

    return res.status(200).json({
      success: true,
      data: {
        wikiOptions,
        tabOptionsMap,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch options',
      details: error.message,
    });
  }
}