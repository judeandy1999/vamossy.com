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

export const useOptionsFrontend = () => {
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

  const { data: tabData, error: tabError, isLoading: tabLoading } = useSWR(
    '/api/tab-options',
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
  const mainCategories = mainCategoriesData ? mainCategoriesData.reduce((acc, category) => {
    acc[category.id] = {
      name: category.name,
      description: category.description || ''
    };
    return acc;
  }, {}) : {};

  const wikiOptions = wikiData ? wikiData.reduce((acc, wiki) => {
    acc[wiki.id] = {
      name: wiki.name,
      description: wiki.description || '',
      main_category_id: wiki.main_category_id
    };
    return acc;
  }, {}) : {};

  const tabOptionsMap = tabData?.data ? tabData.data.reduce((acc, tab) => {
    if (!acc[tab.wiki_id]) acc[tab.wiki_id] = {};
    acc[tab.wiki_id][tab.id] = {
      name: tab.name,
      description: tab.description || ''
    };
    return acc;
  }, {}) : {};

  const loading = mainCategoriesLoading || wikiLoading || tabLoading;
  const error = mainCategoriesError || wikiError || tabError;

  return {
    wikiOptions,
    tabOptionsMap,
    mainCategories,
    loading,
    error,
  };
};