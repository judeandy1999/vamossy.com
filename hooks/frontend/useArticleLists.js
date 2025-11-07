'use client';

import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch article lists');
    }
    return res.json();
  });

export function useArticleLists() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/article-lists',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Transform the data to the expected format
  const articleLists = data ? Object.entries(data).map(([id, list]) => ({
    id: parseInt(id),
    name: list.name,
    description: list.description || '',
    ...list
  })) : [];

  return {
    articleLists,
    loading: isLoading,
    error,
    mutate,
  };
}