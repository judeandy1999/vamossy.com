// hooks/frontend/useArticleCountsByListAndWiki.js
'use client';

import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch counts');
    }
    return res.json();
  });

export function useArticleCountsByListAndWiki(listId) {
  const queryParams = new URLSearchParams();
  
  if (listId) {
    queryParams.set('article_list_id', listId.toString());
    queryParams.set('counts_only', 'true');
  }

  const { data, error, isLoading } = useSWR(
    listId ? `/api/articles/counts-by-list?${queryParams.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    counts: data || {},
    loading: isLoading,
    error
  };
}