'use client';

import useSWRInfinite from 'swr/infinite';

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

const PAGE_SIZE = 10;

export const getAllArticlesKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null;
  return `/api/articles?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
};

export function useAllArticles() {
  const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite(
    getAllArticlesKey,
    fetcher,
    { revalidateFirstPage: false }
  );

  const articles = data ? [].concat(...data) : [];
  const isReachingEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  const addNewArticle = (newArticle) => {
    mutate((pages) => {
      if (!pages) return [];
      const updatedFirstPage = [newArticle, ...pages[0]].slice(0, PAGE_SIZE);
      return [updatedFirstPage, ...pages.slice(1)];
    }, false);
  };

  const updateArticleInSidebar = (updatedArticle) => {
    mutate((pages) => {
      if (!pages) return [];
      const updatedFirstPage = pages[0].map((article) =>
        article.id === updatedArticle.id ? { ...article, ...updatedArticle } : article
      );
      return [updatedFirstPage, ...pages.slice(1)];
    }, false);
  };

  const deleteArticleFromSidebar = async (id) => {
    mutate((pages) => {
      if (!pages) return [];
      const updatedPages = pages.map((page) =>
        page.filter((article) => article.id !== id)
      );
      return updatedPages;
    }, false);

    await mutate();
  };

  return {
    articles,
    loading: isLoading,
    error,
    loadMore: () => setSize(size + 1),
    isReachingEnd,
    addNewArticle,
    updateArticleInSidebar,
    deleteArticleFromSidebar,
  };
}
