'use client';

import { use } from 'react';
import { useArticleMeta } from '@/hooks/useArticleMeta';
import { useArticleContent } from '@/hooks/useArticleContent';
import { useAllArticles } from '@/hooks/useAllArticles';

export default function ArticlePage(props) {
  const params = use(props.params);
  const { articles, loading, error, loadMore, isReachingEnd } = useAllArticles();
  const { data: meta, isLoading: loadingMeta, error: errorMeta } = useArticleMeta(params.id);
  const { data: full, isLoading: loadingContent } = useArticleContent(params.id);

  if (loadingMeta) return <p>Loading metadata...</p>;
  if (errorMeta) return <p>Error loading article.</p>;

  return (
    <div className="flex justify-between gap-24 px-24">
      <article className="px-24 py-10 pt-32">
        <h1 className="text-[48px] font-semibold mb-6">{meta.title}</h1>
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
      <div className="flex flex-col max-w-[20%] px-4 py-10 pt-32">
        <h1 className="text-3xl font-semibold mb-6">Related Article</h1>
        <ul className="space-y-6">
          {articles.map(article => (
            <li key={article.id} className="border-b pb-4">
              <a
                href={`/articles/${article.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(article.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-800 mt-2 line-clamp-2">{article.preview}</p>
            </li>
          ))}
        </ul>

        {loading && <p className="text-center mt-4">Loading...</p>}
      </div>
    </div>
  );
}
