'use client';

import { useAllArticles } from '@/hooks/useAllArticles';
import { Loader2 } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

export default function BlogPage() {
  const { articles, loading, error, loadMore, isReachingEnd } = useAllArticles();

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load articles. Please try again.
      </div>
    );
  }

  if(loading) { 
    return (
      <Spinner />
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">All Articles</h1>

        <ul className="space-y-6">
          {articles.map((article) => (
            <li
              key={article.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <a
                href={`/articles/${article.id}`}
                className="text-xl font-semibold text-slate-800 hover:text-slate-600 transition"
              >
                {article.title}
              </a>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(article.created_at).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  hour12: true
                })}
              </p>
              <p className="text-gray-700 mt-2 line-clamp-2">{article.preview}</p>
            </li>
          ))}
        </ul>

        {!isReachingEnd && !loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
