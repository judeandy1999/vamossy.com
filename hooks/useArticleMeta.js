'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

export function useArticleMeta(id) {
  return useSWR(id ? `/api/articles/${id}?full=false` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15000,
  });
}
