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

export function useArticleCounts() {
  const { data, error, isLoading } = useSWR(
    '/api/articles/counts',
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    counts: data || {},
    loading: isLoading,
    error
  };
}