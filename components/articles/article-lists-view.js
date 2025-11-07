'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowRight, Loader2, Search, X } from 'lucide-react';
import { useArticleLists } from '@/hooks/frontend/useArticleLists';
import { useAllArticles } from '@/hooks/frontend/useAllArticles';
import ArticlesDisplay from './articles-display';

export default function ArticleListsView() {
  const router = useRouter();
  const { articleLists, loading, error } = useArticleLists();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);
  const [articlesPage, setArticlesPage] = useState(1);
  const [filters, setFilters] = useState({ wikiIds: [], mainCategoryIds: [] });

  // Fetch all articles using the updated hook with filters
  const { 
    articles, 
    loading: articlesLoading, 
    error: articlesError, 
    totalPages, 
    totalCount, 
    hasNextPage, 
    hasPrevPage 
  } = useAllArticles(articlesPage, filters);

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleListClick = (listId, listName) => {
    setSelectedListId(listId);
    const slug = createSlug(listName);
    router.push(`/articles/${slug || listId}`);
  };

  const handleArticlesPageChange = (newPage) => {
    setArticlesPage(newPage);
    // Scroll to articles section
    const articlesSection = document.getElementById('articles-section');
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter article lists based on search
  const filteredLists = articleLists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Reset pagination when filters change
    setArticlesPage(1);
  };

  if (error) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            <p className="text-lg mb-2">Failed to load article collections</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen mb-8">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 size={40} className="animate-spin text-[#1f40af] mx-auto mb-4" />
              <p className="text-[#4b5562]">Loading article collections...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen mb-8">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#032646]">
              Article Collections
            </h1>
            <p className="text-lg text-[#4b5562] mt-2">
              Browse our organized collections of articles
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600">
                <span>
                  {filteredLists.length > 0 
                    ? `Found ${filteredLists.length} collection${filteredLists.length === 1 ? '' : 's'} for "${searchQuery}"`
                    : `No collections found for "${searchQuery}"`
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-8">
          <nav className="flex items-center text-md text-[#4b5562]">
            <span className="text-[#032646] text-md font-medium">
              Article Collections
            </span>
          </nav>
        </div>

        {/* Collections Count */}
        <div className="mb-6">
          <div className="flex items-center gap-4 text-sm text-[#4b5562]">
            <span className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              {articleLists.length} total collection{articleLists.length === 1 ? '' : 's'}
            </span>
            {searchQuery && (
              <span className="text-gray-500">
                • {filteredLists.length} shown
              </span>
            )}
          </div>
        </div>

        {/* Article Lists Grid */}
        <div className="w-full mb-12">
          {filteredLists.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-[#4b5562] text-lg">
                {searchQuery 
                  ? `No collections found for "${searchQuery}"`
                  : 'No article collections found'
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {searchQuery
                  ? 'Try searching with different keywords'
                  : 'Article collections will appear here when they are created'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {filteredLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => handleListClick(list.id, list.name)}
                  className={`group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-200 ${
                    selectedListId === list.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#032646] group-hover:text-blue-600 transition-colors duration-200 mb-2">
                            {list.name}
                          </h3>
                          {list.description && (
                            <p className="text-[#4b5562] text-sm line-clamp-3 mb-3">
                              {list.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight 
                          size={20} 
                          className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0 ml-4" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-500">Collection</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {list.article_count !== undefined && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                              {list.article_count} articles
                            </span>
                          )}
                          
                          {list.created_at && (
                            <span className="text-xs text-gray-500">
                              Created {new Date(list.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Summary */}
          {filteredLists.length > 0 && (
            <div className="text-end text-sm text-gray-600 mt-4">
              Showing {filteredLists.length} of {articleLists.length} collection{articleLists.length === 1 ? '' : 's'}
            </div>
          )}
        </div>

        {/* Articles Section - Using ArticlesDisplay Component */}
        <div id="articles-section" className="border-t border-gray-200 pt-12">
          <ArticlesDisplay
            articles={articles}
            loading={articlesLoading}
            error={articlesError}
            totalPages={totalPages}
            totalCount={totalCount}
            currentPage={articlesPage}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onPageChange={handleArticlesPageChange}
            listName="All Articles"
            listDescription="Browse all available articles"
            showBackButton={false}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>
    </div>
  );
}