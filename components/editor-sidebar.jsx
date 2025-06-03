
import { FilePlus, Trash } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

export default function EditorSidebar({
  articles,
  loading,
  isReachingEnd,
  loadMore,
  startNewArticle,
  setSelectedArticle,
  selectedArticle,
  handleDelete,
  error,
  newlyCreatedId,
}) {
  
    return (
      <div className="w-64 bg-gray-100 p-4 overflow-y-auto border-r">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Articles</h2>
        <button
          onClick={startNewArticle}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 w-auto"
        >
          <FilePlus size={16} /> New Article
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">Failed to load articles</p>
      ) : (
        <ul className="space-y-2">
          {articles.map((article, index) => (
            <li
              key={`${article?.id}-${index}`}
              className={`flex justify-between cursor-pointer p-2 rounded hover:bg-gray-200 transition-all duration-300 ${
                selectedArticle?.id === article?.id ? 'bg-gray-300' : ''
              } ${String(article?.id) === String(newlyCreatedId) ? 'animate-popIn' : ''}`}
              onClick={() => setSelectedArticle(article)}
            >
              <div>
                <h3 className="font-medium">{article?.title}</h3>
                <p className="text-xs text-gray-600">
                  {new Date(article?.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(article?.id);
                }}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
          {!isReachingEnd && (
            <button
              onClick={loadMore}
              className="mt-4 text-gray-600 hover:text-blue-400 text-sm rounded px-2 py-1"
            >
              Load More...
            </button>
          )}
        </ul>
      )}
    </div>
    );
}