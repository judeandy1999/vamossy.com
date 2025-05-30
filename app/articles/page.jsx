'use client';

import { useAllArticles } from '@/hooks/useAllArticles';

export default function BlogPage() {
  const { articles, loading, error, loadMore, isReachingEnd } = useAllArticles();

  if (error) return <p className="text-red-500">Failed to load articles</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pt-32">
      <h1 className="text-3xl font-bold mb-6">All Articles</h1>
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

      {/* {!isReachingEnd && (
        <button
          onClick={loadMore}
          className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Load More
        </button>
      )} */}

      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
}
