'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Tag, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  BookOpen,
  FileText,
  Loader2
} from 'lucide-react';
import FilterDropdown from './filter-dropdown';

export default function ArticlesDisplay({ 
  articles, 
  loading, 
  error, 
  totalPages, 
  totalCount, 
  currentPage, 
  hasNextPage, 
  hasPrevPage, 
  onPageChange,
  listName,
  listDescription,
  showBackButton = false,
  backButtonPath = '/articles',
  backButtonText = 'Back to Collections',
  onBackClick,
  filters = { wikiIds: [], mainCategoryIds: [] },
  onFiltersChange
}) {
  const router = useRouter();

  // Handle back button click
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push(backButtonPath);
    }
  };

  // Handle article click - now includes back path in query params
  const handleArticleClick = (articleId) => {
    const backPath = encodeURIComponent(backButtonPath);
    router.push(`/articles/${articleId}?back=${backPath}`);
  };

  // Pagination functions
  const goToPage = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  // Generate page numbers for pagination UI
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
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

  const getPaginationText = () => {
    if (totalCount === 0) {
      return "No articles found";
    }
    
    const pageSize = 10;
    const start = ((currentPage - 1) * pageSize) + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    
    return `Showing ${start}-${end} of ${totalCount} articles`;
  };

  if (error) {
    return (
      <div className="bg-white py-10">
        <div className="text-center text-red-500">
          <p className="text-lg mb-2">Failed to load articles</p>
          <p className="text-sm">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100vh] p-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* {showBackButton && (
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleBackClick}
                  className="cursor-pointer flex items-center gap-2 text-[#4b5562] hover:text-blue-600 transition font-medium bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  {backButtonText}
                </button>
              </div>
            )} */}

            <h2 className="text-3xl md:text-4xl font-bold text-[#032646] mb-2">
              {listName || 'Articles'}
            </h2>
            
            {listDescription && (
              <p className="text-lg text-[#4b5562]">
                {listDescription}
              </p>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-[#4b5562]">
            <span className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              {totalCount} article{totalCount === 1 ? '' : 's'}
            </span>
          </div>

          {/* Filter Dropdown - only show if onFiltersChange is provided */}
          {onFiltersChange && (
            <FilterDropdown
              selectedWikiIds={filters.wikiIds || []}
              selectedMainCategoryIds={filters.mainCategoryIds || []}
              onFiltersChange={onFiltersChange}
            />
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <Loader2 size={40} className="animate-spin text-[#1f40af] mx-auto mb-4" />
              <p className="text-[#4b5562]">Loading articles...</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Articles List */}
          {articles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-[#4b5562] text-lg">
                {showBackButton ? 'No articles found in this collection' : 'No articles found'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Articles will appear here when they are {showBackButton ? 'added to this collection' : 'created'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-6">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-200"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#032646] group-hover:text-blue-600 transition mb-2">
                          {article.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-sm text-[#4b5562]">
                            <Calendar size={16} />
                            <span>
                              {new Date(article.created_at).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Categories */}
                        {article.category_details && article.category_details.length > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Tag size={16} className="text-gray-400" />
                            <div className="flex gap-1 flex-wrap">
                              {article.category_details.map((category, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-[#4b5562] px-2 py-1 rounded">
                                  {category?.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Preview */}
                        {article.preview && (
                          <p className="text-[#4b5562] line-clamp-3">{article.preview}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="flex justify-center items-center space-x-1">
                    {/* First page button */}
                    {currentPage > 3 && (
                      <>
                        <button 
                          onClick={() => goToPage(1)} 
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="px-2 py-2 text-gray-500">
                            <MoreHorizontal size={16} />
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Previous button */}
                    <button 
                      onClick={goToPrevPage}
                      disabled={!hasPrevPage}
                      className={`cursor-pointer flex items-center px-3 py-2 text-sm font-medium border rounded-md transition-colors duration-200 ${
                        hasPrevPage
                          ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                          : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {getPageNumbers().map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`cursor-pointer px-3 py-2 text-sm font-medium border rounded-md transition-colors duration-200 ${
                          currentPage === pageNum 
                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {/* Next button */}
                    <button 
                      onClick={goToNextPage}
                      disabled={!hasNextPage}
                      className={`cursor-pointer flex items-center px-3 py-2 text-sm font-medium border rounded-md transition-colors duration-200 ${
                        hasNextPage
                          ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                          : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                    
                    {/* Last page button */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 py-2 text-gray-500">
                            <MoreHorizontal size={16} />
                          </span>
                        )}
                        <button 
                          onClick={() => goToPage(totalPages)} 
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Pagination text */}
                  <div className="text-sm text-gray-600">
                    {getPaginationText()}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}