import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { article_list_id } = req.query;

  if (!article_list_id) {
    return res.status(400).json({ error: 'article_list_id is required' });
  }

  try {
    // Get counts by wiki_id filtered by article_list_id
    const { data: wikiCounts, error: wikiError } = await supabase
      .from('article_wiki')
      .select(`
        wiki_id,
        articles!inner(
          id,
          article_list_id
        )
      `)
      .eq('articles.article_list_id', parseInt(article_list_id));

    if (wikiError) throw wikiError;

    // Count articles per wiki_id
    const byWikiId = {};
    wikiCounts.forEach(item => {
      const wikiId = item.wiki_id;
      if (!byWikiId[wikiId]) {
        byWikiId[wikiId] = 0;
      }
      byWikiId[wikiId]++;
    });

    // Get counts by main_category_id filtered by article_list_id
    const { data: mainCategoryCounts, error: mainCategoryError } = await supabase
      .from('article_wiki')
      .select(`
        category_options!inner(
          id,
          main_category_id
        ),
        articles!inner(
          id,
          article_list_id
        )
      `)
      .eq('articles.article_list_id', parseInt(article_list_id));

    if (mainCategoryError) throw mainCategoryError;

    // Count articles per main category
    const byMainCategoryId = {};
    let uncategorizedCount = 0;

    mainCategoryCounts.forEach(item => {
      const mainCategoryId = item.category_options.main_category_id;
      
      if (mainCategoryId) {
        if (!byMainCategoryId[mainCategoryId]) {
          byMainCategoryId[mainCategoryId] = new Set();
        }
        byMainCategoryId[mainCategoryId].add(item.articles.id);
      } else {
        // This is uncategorized
        uncategorizedCount++;
      }
    });

    // Convert sets to counts (to avoid double-counting articles with multiple categories in same main category)
    const finalMainCategoryCounts = {};
    Object.keys(byMainCategoryId).forEach(mainCategoryId => {
      finalMainCategoryCounts[mainCategoryId] = byMainCategoryId[mainCategoryId].size;
    });

    // Get total count for this list
    const { count: totalCount, error: totalError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('article_list_id', parseInt(article_list_id));

    if (totalError) throw totalError;

    return res.status(200).json({
      total: totalCount,
      byWikiId,
      byMainCategoryId: finalMainCategoryCounts,
      uncategorized: uncategorizedCount
    });

  } catch (error) {
    console.error('Error fetching list-specific article counts:', error);
    return res.status(500).json({ error: error.message });
  }
}