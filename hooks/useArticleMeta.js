'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url, {
  headers: {
    'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
  },
}).then(res => res.json());

export function useArticleMeta(id) {
  return useSWR(id ? `/api/articles/${id}?full=false` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15000,
  });
}
