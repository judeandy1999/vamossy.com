'use client';

import useSWR from 'swr';

const fetcher = (url) => fetch(url, {
  headers: {
    'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
  },
}).then(res => {
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
});

export const useFilterOptions = () => {
  // Fetch main categories
  const { data: mainCategoriesData, error: mainCategoriesError, isLoading: mainCategoriesLoading } = useSWR(
    '/api/main-categories',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Fetch wiki options (categories)
  const { data: wikiData, error: wikiError, isLoading: wikiLoading } = useSWR(
    '/api/wiki-options',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Format the data
  const mainCategories = mainCategoriesData ? mainCategoriesData.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || ''
  })) : [];

  const wikiOptions = wikiData ? wikiData.map(wiki => ({
    id: wiki.id,
    name: wiki.name,
    description: wiki.description || '',
    main_category_id: wiki.main_category_id,
    main_category_name: wiki.main_categories?.name || null
  })) : [];

  const loading = mainCategoriesLoading || wikiLoading;
  const error = mainCategoriesError || wikiError;

  return {
    mainCategories,
    wikiOptions,
    loading,
    error,
  };
};