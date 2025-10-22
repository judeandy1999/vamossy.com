import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';

// Helper function to get wiki IDs by main category
async function getWikiIdsByMainCategory(mainCategoryId) {
  if (mainCategoryId === 'uncategorized') {
    const { data } = await supabase
      .from('category_options')  // Changed from 'wiki_options'
      .select('id')
      .is('main_category_id', null);
    return data?.map(category => category.id) || [];
  }
  
  const { data } = await supabase
    .from('category_options')  // Changed from 'wiki_options'
    .select('id')
    .eq('main_category_id', parseInt(mainCategoryId));
  return data?.map(category => category.id) || [];
}

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { page = '1', limit = '10', wiki_id, main_category_id } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const from = (pageNumber - 1) * limitNumber;
  const to = from + limitNumber - 1;

  try {
    // Build query with filters
    let query = supabase.from('articles').select('*', { count: 'exact' });
    
    if (wiki_id) {
      query = query.eq('wiki_id', parseInt(wiki_id));
    }
    
    if (main_category_id) {
      const wikiIds = await getWikiIdsByMainCategory(main_category_id);
      query = query.in('wiki_id', wikiIds);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      articles: data,
      totalCount: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / limitNumber)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
