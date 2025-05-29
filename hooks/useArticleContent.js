'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

export function useArticleContent(id) {
  return useSWR(id ? `/api/articles/${id}?full=true` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
}
