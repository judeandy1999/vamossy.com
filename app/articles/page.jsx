'use client';

import { useAllArticles } from '@/hooks/useAllArticles';
import { useArticleContent } from '@/hooks/useArticleContent';
import { useArticleMeta } from '@/hooks/useArticleMeta'; // Add this import
import { useOptions } from '@/hooks/useOptions';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ChevronDown, ChevronRight, ArrowLeft, Calendar, Tag } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { articles, loading, error, loadMore, isReachingEnd } = useAllArticles();
  const { wikiOptions, mainCategories, loading: optionsLoading } = useOptions();
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [selectedWikiId, setSelectedWikiId] = useState(null);
  const [expandedMainCategories, setExpandedMainCategories] = useState(new Set());
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeTab, setActiveTab] = useState(null); 

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim(); // Remove leading/trailing whitespace
  };
  
  // Initialize selectedArticleId from URL on component mount
  useEffect(() => {
    const articleId = searchParams.get('article');
    if (articleId) {
      setSelectedArticleId(parseInt(articleId));
    }
  }, [searchParams]);
  
  // Fetch article content when an article is selected
  const { data: selectedArticle, loading: articleLoading, error: articleError } = useArticleContent(selectedArticleId);
  const { data: selectedArticleMeta } = useArticleMeta(selectedArticleId); // Add meta fetch

  // Add useEffect for tab management
  useEffect(() => {
    if (selectedArticleMeta?.has_tabs && selectedArticle?.tabs) {
      const firstTabId = Object.keys(selectedArticle.tabs)[0];
      setActiveTab(firstTabId);
    } else {
      setActiveTab(null);
    }
  }, [selectedArticleMeta?.has_tabs, selectedArticle?.tabs]);

  // Add this useEffect for collapsible tables
  useEffect(() => {
    const makeTablesCollapsible = () => {
      const tables = document.querySelectorAll('.article-container table');
      
      tables.forEach(table => {
        // Skip if already processed
        if (table.closest('.table-wrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        
        const toggle = document.createElement('div');
        toggle.className = 'table-toggle';
        toggle.innerHTML = `
          <svg class="toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
          <span>Table</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'table-content';
        
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(toggle);
        wrapper.appendChild(content);
        content.appendChild(table);
        
        toggle.addEventListener('click', () => {
          const icon = toggle.querySelector('.toggle-icon');
          const isCollapsed = content.classList.contains('collapsed');
          
          if (isCollapsed) {
            content.classList.remove('collapsed');
            // ChevronDown icon
            icon.innerHTML = '<path d="m6 9 6 6 6-6"/>';
          } else {
            content.classList.add('collapsed');
            // ChevronRight icon
            icon.innerHTML = '<path d="m9 18 6-6-6-6"/>';
          }
        });
      });
    };

    // Run after content is loaded
    if (!articleLoading && (selectedArticle?.content || selectedArticle?.tabs)) {
      setTimeout(makeTablesCollapsible, 100);
    }
  }, [articleLoading, selectedArticle, activeTab]);

  // Early returns should come AFTER all hooks
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load articles. Please try again.
      </div>
    );
  }

  if (loading || optionsLoading) { 
    return <Spinner />;
  }

  const toggleMainCategory = (mainCategoryId) => {
    const newExpanded = new Set(expandedMainCategories);
    if (newExpanded.has(mainCategoryId)) {
      newExpanded.delete(mainCategoryId);
      // Reset selections when collapsing
      if (selectedMainCategoryId === mainCategoryId) {
        setSelectedMainCategoryId(null);
        setSelectedWikiId(null);
      }
    } else {
      newExpanded.add(mainCategoryId);
    }
    setExpandedMainCategories(newExpanded);
  };

  const handleArticleClick = (articleId) => {
    setSelectedArticleId(articleId);
    setActiveTab(null); // Reset tab when selecting new article
    
    // Find the article to get its title
    const article = articles.find(a => a.id === articleId);
    if (article) {
      // Update URL with article ID and name
      const params = new URLSearchParams(searchParams);
      params.set('article', articleId.toString());
      params.set('name', createSlug(article.title));
      router.push(`/articles?${params.toString()}`, { scroll: false });
    }
  };

  const handleBackToArticles = () => {
    setSelectedArticleId(null);
    
    // Remove article ID and name from URL
    const params = new URLSearchParams(searchParams);
    params.delete('article');
    params.delete('name');
    const newUrl = params.toString() ? `/articles?${params.toString()}` : '/articles';
    router.push(newUrl, { scroll: false });
  };

  const updateUrlWithoutArticle = () => {
    // Helper function to update URL and remove article parameters
    const params = new URLSearchParams(searchParams);
    params.delete('article');
    params.delete('name');
    const newUrl = params.toString() ? `/articles?${params.toString()}` : '/articles';
    router.push(newUrl, { scroll: false });
  };

  const getPageTitle = () => {
    if (selectedArticleId && selectedArticle) {
      return selectedArticle.title;
    } else if (selectedWikiId) {
      return `${wikiOptions[selectedWikiId]?.name} Articles`;
    } else if (selectedMainCategoryId === 'uncategorized') {
      return 'Uncategorized Articles';
    } else if (selectedMainCategoryId) {
      return `${mainCategories[selectedMainCategoryId]?.name} Articles`;
    }
    return 'All Articles';
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    breadcrumbs.push({
      label: 'All Articles',
      onClick: () => {
        setSelectedMainCategoryId(null);
        setSelectedWikiId(null);
        setSelectedArticleId(null);
        updateUrlWithoutArticle();
      }
    });

    if (selectedMainCategoryId) {
      breadcrumbs.push({
        label: selectedMainCategoryId === 'uncategorized' 
          ? 'Uncategorized' 
          : mainCategories[selectedMainCategoryId]?.name,
        onClick: () => {
          setSelectedWikiId(null);
          setSelectedArticleId(null);
          updateUrlWithoutArticle();
        }
      });
    }

    if (selectedWikiId) {
      breadcrumbs.push({
        label: wikiOptions[selectedWikiId]?.name,
        onClick: () => {
          setSelectedArticleId(null);
          updateUrlWithoutArticle();
        }
      });
    }

    if (selectedArticleId && selectedArticle) {
      breadcrumbs.push({
        label: `${selectedArticle.title} (#${selectedArticleId})`,
        onClick: null // Current page, not clickable
      });
    }

    return breadcrumbs;
  };

  // Group categories by main category
  const groupedCategories = Object.entries(wikiOptions).reduce((acc, [wikiId, wiki]) => {
    const mainCategoryId = wiki.main_category_id || 'uncategorized';
    if (!acc[mainCategoryId]) {
      acc[mainCategoryId] = [];
    }
    acc[mainCategoryId].push({ id: wikiId, ...wiki });
    return acc;
  }, {});

  // Filter articles based on selections
  const getFilteredArticles = () => {
    if (selectedWikiId) {
      return articles.filter(article => article.wiki_id === selectedWikiId);
    } else if (selectedMainCategoryId && selectedMainCategoryId !== 'uncategorized') {
      const categoriesInMainCategory = groupedCategories[selectedMainCategoryId] || [];
      const categoryIds = categoriesInMainCategory.map(cat => parseInt(cat.id));
      return articles.filter(article => categoryIds.includes(article.wiki_id));
    } else if (selectedMainCategoryId === 'uncategorized') {
      const uncategorizedCategories = groupedCategories['uncategorized'] || [];
      const categoryIds = uncategorizedCategories.map(cat => parseInt(cat.id));
      return articles.filter(article => categoryIds.includes(article.wiki_id));
    }
    return articles;
  };

  const filteredArticles = getFilteredArticles();

  // Get article counts for display
  const getArticleCount = (categoryId) => {
    return articles.filter(article => article.wiki_id === parseInt(categoryId)).length;
  };

  const getMainCategoryArticleCount = (mainCategoryId) => {
    if (mainCategoryId === 'uncategorized') {
      const uncategorizedCategories = groupedCategories['uncategorized'] || [];
      return uncategorizedCategories.reduce((count, cat) => count + getArticleCount(cat.id), 0);
    }
    const categoriesInMainCategory = groupedCategories[mainCategoryId] || [];
    return categoriesInMainCategory.reduce((count, cat) => count + getArticleCount(cat.id), 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
          {getPageTitle()}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Category Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Browse Categories</h2>
              
              {/* All Articles Button */}
              <button
                onClick={() => {
                  setSelectedMainCategoryId(null);
                  setSelectedWikiId(null);
                  setSelectedArticleId(null);
                }}
                className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg mb-3 transition ${
                  !selectedMainCategoryId && !selectedWikiId && !selectedArticleId
                    ? 'bg-slate-600 text-white'
                    : 'hover:bg-gray-50 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">All Articles</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {articles.length}
                  </span>
                </div>
              </button>

              <div className="space-y-1">
                {/* Uncategorized Section */}
                {groupedCategories['uncategorized'] && groupedCategories['uncategorized'].length > 0 && (
                  <div className="mb-2">
                    <button
                      onClick={() => toggleMainCategory('uncategorized')}
                      className="cursor-pointer w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="flex items-center gap-2">
                        {expandedMainCategories.has('uncategorized') ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                        <span className="font-medium text-gray-600">Uncategorized</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {getMainCategoryArticleCount('uncategorized')}
                      </span>
                    </button>

                    {expandedMainCategories.has('uncategorized') && (
                      <div className="ml-6 mt-1 space-y-1">
                        <button
                          onClick={() => {
                            setSelectedMainCategoryId('uncategorized');
                            setSelectedWikiId(null);
                            setSelectedArticleId(null);
                          }}
                          className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                            selectedMainCategoryId === 'uncategorized' && !selectedWikiId && !selectedArticleId
                              ? 'bg-gray-100 text-slate-700 font-medium'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          All Uncategorized ({getMainCategoryArticleCount('uncategorized')})
                        </button>
                        {groupedCategories['uncategorized'].map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedMainCategoryId('uncategorized');
                              setSelectedWikiId(parseInt(category.id));
                              setSelectedArticleId(null);
                            }}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                              selectedWikiId === parseInt(category.id) && !selectedArticleId
                                ? 'bg-gray-100 text-slate-700 font-medium'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{category.name}</span>
                              <span className="text-xs text-gray-500">
                                {getArticleCount(category.id)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Categories */}
                {Object.entries(mainCategories).map(([mainCategoryId, mainCategory]) => {
                  const categoriesInMainCategory = groupedCategories[mainCategoryId] || [];
                  if (categoriesInMainCategory.length === 0) return null;

                  return (
                    <div key={mainCategoryId} className="mb-2">
                      <button
                        onClick={() => toggleMainCategory(mainCategoryId)}
                        className="cursor-pointer w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="flex items-center gap-2">
                          {expandedMainCategories.has(mainCategoryId) ? (
                            <ChevronDown size={16} className="text-blue-500" />
                          ) : (
                            <ChevronRight size={16} className="text-blue-500" />
                          )}
                          <span className="font-medium text-blue-600">{mainCategory.name}</span>
                        </div>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {getMainCategoryArticleCount(mainCategoryId)}
                        </span>
                      </button>

                      {expandedMainCategories.has(mainCategoryId) && (
                        <div className="ml-6 mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setSelectedMainCategoryId(mainCategoryId);
                              setSelectedWikiId(null);
                              setSelectedArticleId(null);
                            }}
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                              selectedMainCategoryId === mainCategoryId && !selectedWikiId && !selectedArticleId
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            All {mainCategory.name} ({getMainCategoryArticleCount(mainCategoryId)})
                          </button>
                          {categoriesInMainCategory.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => {
                                setSelectedMainCategoryId(mainCategoryId);
                                setSelectedWikiId(parseInt(category.id));
                                setSelectedArticleId(null);
                              }}
                              className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                                selectedWikiId === parseInt(category.id) && !selectedArticleId
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{category.name}</span>
                                <span className="text-xs text-gray-500">
                                  {getArticleCount(category.id)}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex items-center text-sm text-gray-600">
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {breadcrumb.onClick ? (
                      <button
                        onClick={breadcrumb.onClick}
                        className="cursor-pointer hover:text-slate-800 transition truncate max-w-[200px]"
                      >
                        {breadcrumb.label}
                      </button>
                    ) : (
                      <span className="text-slate-800 font-medium truncate max-w-[200px]">
                        {breadcrumb.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Article Content View */}
            {selectedArticleId ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Back Button */}
                <div className="border-b border-gray-200 p-6 pb-4">
                  <button
                    onClick={handleBackToArticles}
                    className="cursor-pointer flex items-center gap-2 text-slate-600 hover:text-slate-800 transition mb-4"
                  >
                    <ArrowLeft size={16} />
                    Back to Articles
                  </button>
                </div>

                {/* Article Content */}
                {articleLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                      <Loader2 size={40} className="animate-spin text-slate-600 mx-auto mb-4" />
                      <p className="text-gray-500">Loading article...</p>
                    </div>
                  </div>
                ) : articleError ? (
                  <div className="p-6 text-center text-red-500">
                    <p className="text-lg mb-2">Failed to load article content</p>
                    <p className="text-sm">Please try again or go back to articles.</p>
                  </div>
                ) : selectedArticle ? (
                  <div className="p-6 pl-13">
                    {/* Article Header */}
                    <div className="mb-6">
                      <h1 className="text-3xl font-bold text-slate-800 mb-4">
                        {selectedArticle.title}
                      </h1>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            {new Date(selectedArticle.created_at).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                              hour12: true
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Tag size={16} />
                          <div className="flex gap-2">
                            {wikiOptions[selectedArticle.wiki_id]?.main_category_id && (
                              <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                                {mainCategories[wikiOptions[selectedArticle.wiki_id].main_category_id]?.name}
                              </span>
                            )}
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                              {wikiOptions[selectedArticle.wiki_id]?.name || 'Unknown Category'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Article Body */}
                    {selectedArticleMeta?.has_tabs && selectedArticle?.tabs ? (
                      <div>
                        {/* Tabs Navigation */}
                        <div className="flex gap-2 sm:gap-4 border-b border-gray-200 mb-6">
                          {Object.entries(selectedArticle.tabs).map(([tabId, tabContent]) => (
                            <button
                              key={tabId}
                              onClick={() => setActiveTab(tabId)}
                              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-t transition focus:outline-none ${
                                activeTab === tabId
                                  ? 'bg-slate-100 text-slate-700 border-b-2 border-slate-500'
                                  : 'text-gray-500 hover:text-slate-600'
                              }`}
                            >
                              {tabContent.name}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <div className="article-container max-w-none text-gray-800 leading-relaxed">
                          {activeTab ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedArticle.tabs[activeTab].content }} />
                          ) : (
                            <p className="text-gray-500">Select a tab to view its content.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="article-container max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: selectedArticle?.content }}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              /* Articles List View */
              <>
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-lg">
                      {selectedWikiId 
                        ? `No articles found in ${wikiOptions[selectedWikiId]?.name}`
                        : selectedMainCategoryId === 'uncategorized'
                        ? 'No uncategorized articles found'
                        : selectedMainCategoryId
                        ? `No articles found in ${mainCategories[selectedMainCategoryId]?.name}`
                        : 'No articles found'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredArticles.map((article) => (
                      <div
                        key={article.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                        onClick={() => handleArticleClick(article.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-800 hover:text-slate-600 transition mb-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-4 mb-3">
                              <p className="text-sm text-gray-500">
                                {new Date(article.created_at).toLocaleString([], {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                  hour12: true
                                })}
                              </p>
                              <div className="flex items-center gap-2">
                                {wikiOptions[article.wiki_id]?.main_category_id && (
                                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                    {mainCategories[wikiOptions[article.wiki_id].main_category_id]?.name}
                                  </span>
                                )}
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                  {wikiOptions[article.wiki_id]?.name || 'Unknown Category'}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700 line-clamp-3">{article.preview}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {!isReachingEnd && !loading && !selectedWikiId && !selectedMainCategoryId && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={loadMore}
                      className="cursor-pointer px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2"
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
