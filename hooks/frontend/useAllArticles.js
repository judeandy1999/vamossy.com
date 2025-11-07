'use client';

import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }
    return res.json();
  });

const PAGE_SIZE = 10;

export function useAllArticles(currentPage = 1, filters = {}) {
  const { selectedWikiId, selectedMainCategoryId, searchQuery, wikiIds = [], mainCategoryIds = [] } = filters;
  
  const queryParams = {
    page: currentPage,
    limit: PAGE_SIZE,
  };
  
  // Single wiki filter (for existing functionality)
  if (selectedWikiId) {
    queryParams.wiki_id = selectedWikiId;
  }
  
  // Single main category filter (for existing functionality)
  if (selectedMainCategoryId) {
    queryParams.main_category_id = selectedMainCategoryId;
  }

  // Multiple wiki filters (for dropdown filters)
  if (wikiIds.length > 0) {
    queryParams.wiki_ids = wikiIds.join(',');
  }

  // Multiple main category filters (for dropdown filters)
  if (mainCategoryIds.length > 0) {
    queryParams.main_category_ids = mainCategoryIds.join(',');
  }

  // Search parameter
  if (searchQuery && searchQuery.trim()) {
    queryParams.search = searchQuery.trim();
  }
  
  const queryString = new URLSearchParams(queryParams).toString();

  const { data, error, isLoading, mutate } = useSWR(
    `/api/articles?${queryString}`,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  // For pagination, we need total count from the API
  const articles = data?.articles || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const addNewArticle = (newArticle) => {
    // Only update if we're on the first page and no filters/search are applied
    if (currentPage === 1 && !selectedWikiId && !selectedMainCategoryId && !searchQuery && wikiIds.length === 0 && mainCategoryIds.length === 0) {
      mutate(
        (current) => ({
          ...current,
          articles: [newArticle, ...(current?.articles || [])],
          totalCount: (current?.totalCount || 0) + 1
        }),
        false
      );
    }
  };

  const updateArticleInSidebar = (updatedArticle) => {
    mutate(
      (current) => {
        if (!current) return current;
        const updatedArticles = current.articles.map((article) =>
          article.id === updatedArticle.id ? { ...article, ...updatedArticle } : article
        );
        return { ...current, articles: updatedArticles };
      },
      false
    );
  };

  const deleteArticleFromSidebar = async (id) => {
    mutate(
      (current) => {
        if (!current) return current;
        const filteredArticles = current.articles.filter((article) => article.id !== id);
        return {
          ...current,
          articles: filteredArticles,
          totalCount: Math.max(0, (current.totalCount || 0) - 1)
        };
      },
      false
    );

    await mutate();
  };

  return {
    articles,
    loading: isLoading,
    error,
    totalPages,
    totalCount,
    currentPage,
    hasNextPage,
    hasPrevPage,
    addNewArticle,
    updateArticleInSidebar,
    deleteArticleFromSidebar,
  };
}