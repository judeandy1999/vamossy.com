'use client';

import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });

export function useArticle(id, options = {}) {
  const { full = true } = options;
  const url = id ? `/api/articles/${id}?full=${full}` : null;

  const { data, error, isLoading } = useSWR(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
    }
  );

  return {
    article: data || null,
    loading: isLoading,
    error: error?.message || null,
  };
}
