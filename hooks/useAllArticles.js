// hooks/useArticles.js
'use client';

import useSWRInfinite from 'swr/infinite';

const fetcher = (url) => fetch(url).then(res => res.json());

const PAGE_SIZE = 5;

export function useAllArticles() {
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null; // end
    return `/api/articles?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  });

  const articles = data ? [].concat(...data) : [];
  const isReachingEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  return {
    articles,
    loading: isLoading,
    error,
    loadMore: () => setSize(size + 1),
    isReachingEnd,
  };
}
