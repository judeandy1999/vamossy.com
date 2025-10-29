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

  const { 
    page = '1', 
    limit = '10', 
    wiki_id, 
    main_category_id,
    search // Add search parameter
  } = req.query;
  
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
      // When filtering by specific category, only show articles that have that category
      query = supabase
        .from('articles')
        .select(`
          *,
          article_wiki!inner(
            wiki_id,
            category_options(id, name, main_category_id)
          )
        `, { count: 'exact' })
        .eq('article_wiki.wiki_id', parseInt(wiki_id));
    }
    
    // Filter by main category through junction table
    if (main_category_id && !wiki_id) {
      if (main_category_id === 'uncategorized') {
        // Show articles with no categories at all
        query = supabase
          .from('articles')
          .select(`
            *,
            article_wiki!left(
              wiki_id,
              category_options(id, name, main_category_id)
            )
          `, { count: 'exact' })
          .is('article_wiki.wiki_id', null);
      } else {
        // Show articles that have categories in this main category
        query = supabase
          .from('articles')
          .select(`
            *,
            article_wiki!inner(
              wiki_id,
              category_options!inner(id, name, main_category_id)
            )
          `, { count: 'exact' })
          .eq('article_wiki.category_options.main_category_id', parseInt(main_category_id));
      }
    }

    // Add search functionality
    if (search && search.trim()) {
      const searchTerm = search.trim();
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Articles query error:', error);
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
      totalPages: Math.ceil(count / limitNumber),
      searchQuery: search || null
    });
  } catch (error) {
    console.error('Articles API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
