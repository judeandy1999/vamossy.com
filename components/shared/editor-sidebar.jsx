import { useState } from 'react';
import { FilePlus, Trash, Loader2 } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

export default function EditorSidebar({
  articles,
  loading,
  isReachingEnd,
  loadMore,
  startNewArticle,
  setSelectedArticle,
  selectedArticleId,
  handleDelete,
  error,
  newlyCreatedId,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetArticle, setTargetArticle] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openModal = (article) => {
    setTargetArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTargetArticle(null);
  };

  const confirmDelete = async () => {
    if (targetArticle) {
      setDeleting(true);
      try {
        await handleDelete(targetArticle.id);
        closeModal();
      } catch (error) {
        console.error('Error deleting article:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Articles</h2>
        <button
          onClick={startNewArticle}
          className="cursor-pointer flex items-center gap-1 bg-slate-600 hover:bg-slate-700 text-gray-300 rounded px-2 py-1 text-sm transition"
        >
          <FilePlus size={16} /> New
        </button>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="flex justify-center py-8 text-slate-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">Failed to load articles</p>
      ) : (
        <ul className="flex-1 space-y-2">
          {articles.map((article, index) => (
            <li
              key={`${article?.id}-${index}`}
              className={`flex justify-between items-start cursor-pointer p-2 rounded hover:bg-slate-200 transition ${
                selectedArticleId === article?.id ? 'bg-slate-200' : ''
              } ${String(article?.id) === String(newlyCreatedId) ? 'animate-popIn' : ''}`}
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex-1 overflow-auto">
                <h3 className="whitespace-normal text-sm font-medium text-slate-800 truncate">{article?.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(article?.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short', hour12: true })}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(article);
                }}
                className="text-red-500 hover:text-red-600 transition"
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
          {!isReachingEnd && (
            <button
              onClick={loadMore}
              className="mt-4 w-full text-slate-600 hover:text-slate-800 text-xs rounded py-1 transition"
            >
              Load More...
            </button>
          )}
        </ul>
      )}

      {/* Deletion Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        target={{ type: 'article', name: targetArticle?.title }}
        isLoading={deleting}
      />
    </div>
  );
}
