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

  // Fetch all articles without filters
  const { 
    articles, 
    loading: articlesLoading, 
    error: articlesError, 
    totalPages, 
    totalCount, 
    hasNextPage, 
    hasPrevPage 
  } = useAllArticles(articlesPage, {});

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
    router.push(`/articles/lists/${slug || listId}`);
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
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading article collections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#032646] mb-4">Article Collections</h1>
          <p className="text-xl text-[#4b5562] max-w-3xl mx-auto">
            Explore our curated collections of articles organized by topic and theme
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Article Lists Grid */}
        <div className="mb-16">
          {filteredLists.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-[#032646] mb-2">
                {searchQuery ? 'No collections found' : 'No collections available'}
              </h3>
              <p className="text-[#4b5562]">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Collections will appear here when they are created'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200 ml-4 flex-shrink-0" 
                        />
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

        {/* Articles Section - Show all articles without filters */}
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
            // Remove filters prop to disable dropdown
          />
        </div>
      </div>
    </div>
  );
}