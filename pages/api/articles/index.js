import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';

// Helper function to get wiki IDs by main category
async function getWikiIdsByMainCategory(mainCategoryId) {
  if (mainCategoryId === 'uncategorized') {
    const { data } = await supabase
      .from('category_options')
      .select('id')
      .is('main_category_id', null);
    return data?.map(category => category.id) || [];
  }
  
  const { data } = await supabase
    .from('category_options')
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
    // Build query with junction table joins
    let query = supabase
      .from('articles')
      .select(`
        *,
        article_wiki!left(
          wiki_id,
          category_options(id, name, main_category_id)
        )
      `, { count: 'exact' });
    
    // Filter by specific wiki_id through junction table
    if (wiki_id) {
      query = query.eq('article_wiki.wiki_id', parseInt(wiki_id));
    }
    
    // Filter by main category through junction table
    if (main_category_id) {
      const wikiIds = await getWikiIdsByMainCategory(main_category_id);
      if (wikiIds.length > 0) {
        query = query.in('article_wiki.wiki_id', wikiIds);
      } else {
        // No articles match this main category
        return res.status(200).json({
          articles: [],
          totalCount: 0,
          currentPage: pageNumber,
          totalPages: 0
        });
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    // Transform the data to include categories array
    const transformedArticles = data?.map(article => ({
      ...article,
      categories: article.article_wiki?.map(aw => aw.wiki_id) || [],
      category_details: article.article_wiki?.map(aw => aw.category_options) || []
    })) || [];

    return res.status(200).json({
      articles: transformedArticles,
      totalCount: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / limitNumber)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
