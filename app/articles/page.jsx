'use client';

import { Suspense } from 'react';
import ArticlesPageContent from './articles-page-content';
import Spinner from '@/components/ui/spinner';

export default function BlogPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ArticlesPageContent />
    </Suspense>
  );
}
