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

export function useArticlesByList(listId, page = 1, limit = 10) {
  const queryParams = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (listId) {
    queryParams.article_list_id = listId.toString();
  }

  const queryString = new URLSearchParams(queryParams).toString();

  const { data, error, isLoading, mutate } = useSWR(
    listId ? `/api/articles?${queryString}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  const articles = data?.articles || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    articles,
    loading: isLoading,
    error,
    totalPages,
    totalCount,
    currentPage: page,
    hasNextPage,
    hasPrevPage,
    mutate,
  };
}