'use client';

import { use } from 'react';
import { useArticleMeta } from '@/hooks/useArticleMeta';
import { useArticleContent } from '@/hooks/useArticleContent';

export default function ArticlePage(props) {
  const params = use(props.params); // unwrap the promise
  const { data: meta, isLoading: loadingMeta, error: errorMeta } = useArticleMeta(params.id);
  const { data: full, isLoading: loadingContent } = useArticleContent(params.id);

  if (loadingMeta) return <p>Loading metadata...</p>;
  if (errorMeta) return <p>Error loading article.</p>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-10 pt-32">
      <h1 className="text-3xl font-bold mb-6">{meta.title}</h1>
      <p className="text-sm text-gray-600 mt-1">
        {new Date(meta.created_at).toLocaleDateString()}
      </p>

      {loadingContent ? (
        <p className="mt-6 text-gray-500">Loading content...</p>
      ) : (
        <div
          className="prose prose-lg text-gray-900"
          dangerouslySetInnerHTML={{ __html: full?.content }}
        />
      )}
    </article>
  );
}
