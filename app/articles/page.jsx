'use client';

import { Suspense } from 'react';
import ArticleListsView from '@/components/articles/article-lists-view';
import Spinner from '@/components/ui/spinner';

export default function BlogPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ArticleListsView />
    </Suspense>
  );
}
