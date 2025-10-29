import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get total article count
    const { count: totalCount, error: totalError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get counts by wiki_id (each article-wiki relationship is counted)
    const { data: wikiCounts, error: wikiError } = await supabase
      .from('article_wiki')
      .select(`
        wiki_id,
        articles!inner(id)
      `);

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

    // Get counts by main_category_id
    const { data: mainCategoryCounts, error: mainCategoryError } = await supabase
      .from('article_wiki')
      .select(`
        category_options!inner(
          id,
          main_category_id
        ),
        articles!inner(id)
      `);

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

    return res.status(200).json({
      total: totalCount,
      byWikiId,
      byMainCategoryId: finalMainCategoryCounts,
      uncategorized: uncategorizedCount
    });

  } catch (error) {
    console.error('Error fetching article counts:', error);
    return res.status(500).json({ error: error.message });
  }
}