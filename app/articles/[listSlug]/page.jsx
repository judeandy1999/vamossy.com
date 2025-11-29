'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import ArticlesDisplay from '@/components/articles/articles-display';
import { useArticlesByList } from '@/hooks/frontend/useArticlesByList';
import { useArticleLists } from '@/hooks/frontend/useArticleLists';
import Spinner from '@/components/ui/spinner';

export default function ArticleListPage(props) {
  const params = use(props.params);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState(null);
  const [listId, setListId] = useState(null);

  const { articleLists, loading: listsLoading, error: listsError } = useArticleLists();
  
  // Create slug function (no need to memoize this)
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Find list when articleLists or params change
  useEffect(() => {
    if (!articleLists || articleLists.length === 0 || !params.listSlug || listsLoading) {
      return;
    }

    // Try to find by ID first
    let foundList = articleLists.find(list => list.id.toString() === params.listSlug);
    
    if (!foundList) {
      // Create slug from name and try to match
      foundList = articleLists.find(list => {
        const slug = createSlug(list.name);
        return slug === params.listSlug;
      });
    }

    if (foundList) {
      setListData(foundList);
      setListId(foundList.id);
    } else {
      // Only set to null if we've finished loading and still no match
      setListData(null);
      setListId(null);
    }
  }, [params.listSlug, listsLoading]);

  const { 
    articles, 
    loading: articlesLoading, 
    error: articlesError, 
    totalPages, 
    totalCount, 
    hasNextPage, 
    hasPrevPage 
  } = useArticlesByList(listId, currentPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle loading states
  if (listsLoading) {
    return <Spinner />;
  }

  if (listsError) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            <p className="text-lg mb-2">Failed to load article collections</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where list is not found - only show this if loading is complete
  if (!listsLoading && articleLists.length > 0 && listData === null) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="text-center">
            <p className="text-lg mb-2 text-gray-600">Article collection not found</p>
            <p className="text-sm text-gray-500 mb-4">
              The collection "{params.listSlug}" could not be found.
            </p>
            <button 
              onClick={() => router.push('/articles')}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Return to article collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while we're still finding the list
  if (!listData) {
    return <Spinner />;
  }

  return (
    <ArticlesDisplay
      articles={articles}
      loading={articlesLoading}
      error={articlesError}
      totalPages={totalPages}
      totalCount={totalCount}
      currentPage={currentPage}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      onPageChange={handlePageChange}
      listName={listData?.name}
      listDescription={listData?.description}
      showBackButton={true}
      backButtonPath="/articles"
    />
  );
}