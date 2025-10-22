import { useState } from 'react';
import { FilePlus, Trash, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

export default function EditorSidebar({
  articles,
  loading,
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
  goToPage,
  goToNextPage,
  goToPrevPage,
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

  // Generate page numbers for pagination (show max 3 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
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
        <>
        <div className="flex-1 flex flex-col overflow-y-auto max-h-[80vh]">
          {/* Articles List */}
          <ul className="flex-1 space-y-2 mb-4">
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
          </ul>
        </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 pt-3 mt-auto">
              {/* Page Navigation */}
              <div className="flex justify-center items-center space-x-1 mb-2">
                {/* Previous button */}
                <button 
                  onClick={goToPrevPage}
                  disabled={!hasPrevPage}
                  className={`cursor-pointer p-1 rounded transition-colors ${
                    hasPrevPage
                      ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft size={14} />
                </button>
                
                {/* Page numbers */}
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`cursor-pointer px-2 py-1 text-xs rounded transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-slate-600 text-white' 
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                {/* Next button */}
                <button 
                  onClick={goToNextPage}
                  disabled={!hasNextPage}
                  className={`cursor-pointer p-1 rounded transition-colors ${
                    hasNextPage
                      ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Page info */}
              <div className="text-center text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </>
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