import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get total article count
    const { count: totalCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    // Get all articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, wiki_id');

    if (articlesError) {
      throw articlesError;
    }

    // Get all category options (the correct table name)
    const { data: categoryOptions, error: categoryError } = await supabase
      .from('category_options')
      .select('id, name, main_category_id');

    if (categoryError) {
      throw categoryError;
    }

    // Create a map of category_id to category_option for fast lookup
    const categoryMap = {};
    categoryOptions.forEach(category => {
      categoryMap[category.id] = category;
    });

    // Calculate counts by category
    const counts = {
      total: totalCount,
      byWikiId: {},
      byMainCategoryId: {},
      uncategorized: 0
    };

    articles.forEach(article => {
      const wikiId = article.wiki_id;
      const categoryOption = categoryMap[wikiId];
      const mainCategoryId = categoryOption?.main_category_id;

      // Count by wiki_id (category_id)
      counts.byWikiId[wikiId] = (counts.byWikiId[wikiId] || 0) + 1;

      // Count by main_category_id
      if (mainCategoryId) {
        counts.byMainCategoryId[mainCategoryId] = (counts.byMainCategoryId[mainCategoryId] || 0) + 1;
      } else {
        counts.uncategorized += 1;
      }
    });

    return res.status(200).json(counts);
  } catch (error) {
    console.error('Counts API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}