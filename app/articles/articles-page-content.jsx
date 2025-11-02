'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, ArrowLeft, Calendar, Tag, Loader2, ChevronLeft, MoreHorizontal, Search, X } from 'lucide-react';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useOptions } from '@/hooks/useOptions';
import { useArticleContent } from '@/hooks/useArticleContent';
import { useArticleMeta } from '@/hooks/useArticleMeta';
import { useArticleCounts } from '@/hooks/useArticleCounts';

export default function ArticlesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ALL STATE HOOKS FIRST
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [selectedWikiId, setSelectedWikiId] = useState(null);
  const [expandedMainCategories, setExpandedMainCategories] = useState(new Set());
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [currentTabPage, setCurrentTabPage] = useState(0);
  const [tabsPerPage, setTabsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(''); // New search query state
  const searchResultsContainerRef = useRef(null);
  
  // ALL REF HOOKS
  const tabsContainerRef = useRef(null);
  
  // ALL CUSTOM HOOKS
  const { articles, loading, error, totalPages, totalCount, hasNextPage, hasPrevPage } = useAllArticles(
    currentPage, 
    { selectedWikiId, selectedMainCategoryId, searchQuery } // Use searchQuery directly
  );
  const { counts, loading: countsLoading } = useArticleCounts();
  const { wikiOptions, mainCategories, loading: optionsLoading } = useOptions();
  const { data: selectedArticle, loading: articleLoading, error: articleError } = useArticleContent(selectedArticleId);
  const { data: selectedArticleMeta } = useArticleMeta(selectedArticleId);

  // ALL USEEFFECTS
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelectedArticleId(parseInt(id));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedArticleMeta?.has_tabs && selectedArticle?.tabs) {
      const sortedTabs = getSortedTabs();
      if (sortedTabs.length > 0 && !activeTab) {
        setActiveTab(sortedTabs[0][0]);
      }
    } else {
      setActiveTab(null);
    }
  }, [selectedArticleMeta?.has_tabs, selectedArticle?.tabs]);

  useEffect(() => {
    const calculateTabsPerPage = () => {
      if (tabsContainerRef.current && selectedArticle?.tabs) {
        const containerWidth = tabsContainerRef.current.offsetWidth;
        const estimatedTabWidth = 150;
        const availableWidth = containerWidth - 100;
        const calculatedTabsPerPage = Math.max(3, Math.floor(availableWidth / estimatedTabWidth));
        setTabsPerPage(calculatedTabsPerPage);
      }
    };

    calculateTabsPerPage();
    window.addEventListener('resize', calculateTabsPerPage);
    return () => window.removeEventListener('resize', calculateTabsPerPage);
  }, [selectedArticle?.tabs, selectedArticleId]);

  useEffect(() => {
    if (!articleLoading && selectedArticle) {
      const timer = setTimeout(() => {
        const tables = document.querySelectorAll('.article-container table');
        tables.forEach((table, index) => {
          if (!table.closest('.table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            wrapper.style.cssText = `
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              margin: 16px 0;
              overflow: hidden;
              background: white;
            `;
            
            const header = document.createElement('div');
            header.className = 'table-header';
            header.style.cssText = `
              background: #f9fafb;
              padding: 12px 16px;
              border-bottom: 1px solid #e5e7eb;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-weight: 600;
              color: #374151;
            `;
            
            const title = document.createElement('span');
            title.textContent = `Table ${index + 1}`;
            
            const chevron = document.createElement('span');
            chevron.innerHTML = '▼';
            chevron.style.cssText = 'transition: transform 0.2s; font-size: 12px;';
            
            header.appendChild(title);
            header.appendChild(chevron);
            
            const content = document.createElement('div');
            content.className = 'table-content';
            content.style.cssText = 'overflow-x: auto; max-height: 400px; overflow-y: auto;';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(header);
            wrapper.appendChild(content);
            content.appendChild(table);
            
            let isCollapsed = false;
            header.addEventListener('click', () => {
              isCollapsed = !isCollapsed;
              content.style.display = isCollapsed ? 'none' : 'block';
              chevron.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
            });
          }
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [articleLoading, selectedArticle, activeTab]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMainCategoryId, selectedWikiId]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ALL FUNCTIONS (these can be defined after hooks)
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const getSortedTabs = () => {
    if (!selectedArticle?.tabs) return [];
    return Object.entries(selectedArticle.tabs).sort((a, b) => {
      const orderA = a[1].order || 999;
      const orderB = b[1].order || 999;
      return orderA - orderB;
    });
  };

  // Tab navigation functions for article tabs (not main pagination)
  const getVisibleTabs = () => {
    if (!selectedArticle?.tabs) return [];
    const sortedTabs = getSortedTabs();
    const startIndex = currentTabPage * tabsPerPage;
    const endIndex = startIndex + tabsPerPage;
    return sortedTabs.slice(startIndex, endIndex);
  };

  const getTotalTabPages = () => {
    if (!selectedArticle?.tabs) return 0;
    return Math.ceil(Object.keys(selectedArticle.tabs).length / tabsPerPage);
  };

  const goToPreviousTabPage = () => {
    if (currentTabPage > 0) {
      setCurrentTabPage(prev => prev - 1);
    }
  };

  const goToNextTabPage = () => {
    if (currentTabPage < getTotalTabPages() - 1) {
      setCurrentTabPage(prev => prev + 1);
    }
  };

  const canGoPrevious = currentTabPage > 0;
  const canGoNext = currentTabPage < getTotalTabPages() - 1;
  const needsPagination = selectedArticle?.tabs && Object.keys(selectedArticle.tabs).length > tabsPerPage;

  // NOW EARLY RETURNS CAN HAPPEN AFTER ALL HOOKS
  if (error) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            <p className="text-lg mb-2">Failed to load articles</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleMainCategory = (mainCategoryId) => {
    const newExpanded = new Set(expandedMainCategories);
    if (newExpanded.has(mainCategoryId)) {
      newExpanded.delete(mainCategoryId);
    } else {
      newExpanded.add(mainCategoryId);
    }
    setExpandedMainCategories(newExpanded);
  };

  const handleArticleClick = (articleId) => {
    setSelectedArticleId(articleId);
    const params = new URLSearchParams(searchParams);
    params.set('id', articleId.toString());
    router.push(`/articles?${params.toString()}`, { scroll: false });
  };

  const handleBackToArticles = () => {
    setSelectedArticleId(null);
    setActiveTab(null);
    updateUrlWithoutArticle();
  };

  const updateUrlWithoutArticle = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('id');
    const newUrl = params.toString() ? `/articles?${params.toString()}` : '/articles';
    router.push(newUrl, { scroll: false });
  };

  const getPageTitle = () => {
    if (selectedArticleId && selectedArticle) {
      return selectedArticle.title;
    }
    if (selectedWikiId && wikiOptions[selectedWikiId]) {
      return `${wikiOptions[selectedWikiId].name} Articles`;
    }
    if (selectedMainCategoryId === 'uncategorized') {
      return 'Uncategorized Articles';
    }
    if (selectedMainCategoryId && mainCategories[selectedMainCategoryId]) {
      return `${mainCategories[selectedMainCategoryId].name} Articles`;
    }
    return 'All Articles';
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    if (selectedArticleId && selectedArticle) {
      breadcrumbs.push({
        label: 'Articles',
        onClick: () => {
          setSelectedArticleId(null);
          setActiveTab(null);
          updateUrlWithoutArticle();
        }
      });
      
      if (selectedWikiId && wikiOptions[selectedWikiId]) {
        const wiki = wikiOptions[selectedWikiId];
        if (wiki.main_category_id && mainCategories[wiki.main_category_id]) {
          breadcrumbs.push({
            label: mainCategories[wiki.main_category_id].name,
            onClick: () => {
              setSelectedMainCategoryId(wiki.main_category_id);
              setSelectedWikiId(null);
              setSelectedArticleId(null);
              setActiveTab(null);
              updateUrlWithoutArticle();
            }
          });
        }
        breadcrumbs.push({
          label: wiki.name,
          onClick: () => {
            setSelectedWikiId(selectedWikiId);
            setSelectedArticleId(null);
            setActiveTab(null);
            updateUrlWithoutArticle();
          }
        });
      }
      
      breadcrumbs.push({
        label: selectedArticle.title
      });
    } else {
      breadcrumbs.push({ label: 'Articles' });
      
      if (selectedMainCategoryId === 'uncategorized') {
        breadcrumbs.push({ label: 'Uncategorized' });
      } else if (selectedMainCategoryId && mainCategories[selectedMainCategoryId]) {
        breadcrumbs.push({ label: mainCategories[selectedMainCategoryId].name });
      }
      
      if (selectedWikiId && wikiOptions[selectedWikiId]) {
        breadcrumbs.push({ label: wikiOptions[selectedWikiId].name });
      }
    }
    
    return breadcrumbs;
  };

  // Group categories by main category
  const groupedCategories = Object.entries(wikiOptions).reduce((acc, [wikiId, wiki]) => {
    const mainCategoryId = wiki.main_category_id;
    if (mainCategoryId && mainCategories[mainCategoryId]) {
      if (!acc[mainCategoryId]) {
        acc[mainCategoryId] = [];
      }
      acc[mainCategoryId].push({ id: wikiId, name: wiki.name });
    } else {
      if (!acc['uncategorized']) {
        acc['uncategorized'] = [];
      }
      acc['uncategorized'].push({ id: wikiId, name: wiki.name });
    }
    return acc;
  }, {});

  const filteredArticles = articles; // No client-side filtering needed anymore

  // Get article counts for display
  const getArticleCount = (categoryId) => {
    return counts?.byWikiId?.[parseInt(categoryId)] || 0;
  };

  const getMainCategoryArticleCount = (mainCategoryId) => {
    if (mainCategoryId === 'uncategorized') {
      return counts?.uncategorized || 0;
    }
    return counts?.byMainCategoryId?.[mainCategoryId] || 0;
  };

  const getTotalArticleCount = () => {
    return counts?.total || 0;
  };

  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Generate page numbers for pagination UI
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show 5 page numbers at most
    
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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Show a minimal placeholder during hydration
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-200 rounded-lg h-96"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen mb-8">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#032646]">
            {getPageTitle()}
          </h1>
          {!selectedArticleId && (
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles..."
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
                  {loading ? (
                    <span>Searching...</span>
                  ) : (
                    <span>
                      {totalCount > 0 
                        ? `Found ${totalCount} article${totalCount === 1 ? '' : 's'} for "${searchQuery}"`
                        : `No articles found for "${searchQuery}"`
                      }
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-[#032646] mb-6">Browse Categories</h2>
              
              {optionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  {/* All Articles Button */}
                  <button
                    onClick={() => {
                      setSelectedMainCategoryId(null);
                      setSelectedWikiId(null);
                      setSelectedArticleId(null);
                      setActiveTab(null);
                      updateUrlWithoutArticle();
                    }}
                    className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg mb-3 transition font-medium ${
                      !selectedMainCategoryId && !selectedWikiId && !selectedArticleId
                        ? 'bg-[#1f40af] text-white'
                        : 'hover:bg-blue-50 text-[#4b5562] hover:text-blue-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>All Articles</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        !selectedMainCategoryId && !selectedWikiId && !selectedArticleId
                          ? 'bg-blue-100 text-[#1f40af]'
                          : 'bg-gray-100 text-[#4b5562]'
                      }`}>
                        {getTotalArticleCount()}
                      </span>
                    </div>
                  </button>

                  <div className="space-y-1">
                    {/* Uncategorized Section */}
                    {groupedCategories['uncategorized'] && groupedCategories['uncategorized'].length > 0 && (
                      <div className="mb-2">
                        <button
                          onClick={() => toggleMainCategory('uncategorized')}
                          className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition"
                        >
                          <div className="flex items-center gap-2">
                            {expandedMainCategories.has('uncategorized') ? (
                              <ChevronDown size={16} className="text-[#4b5562]" />
                            ) : (
                              <ChevronRight size={16} className="text-[#4b5562]" />
                            )}
                            <span className="font-medium text-[#4b5562]">Uncategorized</span>
                          </div>
                          <span className="text-xs bg-gray-100 text-[#4b5562] px-2 py-1 rounded">
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
                                setActiveTab(null);
                                updateUrlWithoutArticle();
                              }}
                              className={`cursor-pointer w-full text-left px-4 py-2 rounded text-sm transition ${
                                selectedMainCategoryId === 'uncategorized' && !selectedWikiId && !selectedArticleId
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'hover:bg-blue-50 text-[#4b5562] hover:text-blue-600'
                              }`}
                            >
                              All Uncategorized ({getMainCategoryArticleCount('uncategorized')})
                            </button>
                            {groupedCategories['uncategorized'].map((category) => (
                              <button
                                key={category.id}
                                onClick={() => {
                                  setSelectedWikiId(parseInt(category.id));
                                  setSelectedMainCategoryId('uncategorized');
                                  setSelectedArticleId(null);
                                  setActiveTab(null);
                                  updateUrlWithoutArticle();
                                }}
                                className={`cursor-pointer w-full text-left px-4 py-2 rounded text-sm transition ${
                                  selectedWikiId === parseInt(category.id) && !selectedArticleId
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'hover:bg-blue-50 text-[#4b5562] hover:text-blue-600'
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
                    {Object.entries(mainCategories).map(([mainCategoryId, mainCategory]) => (
                      <div key={mainCategoryId} className="mb-2">
                        <button
                          onClick={() => toggleMainCategory(mainCategoryId)}
                          className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition"
                        >
                          <div className="flex items-center gap-2">
                            {expandedMainCategories.has(mainCategoryId) ? (
                              <ChevronDown size={16} className="text-[#4b5562]" />
                            ) : (
                              <ChevronRight size={16} className="text-[#4b5562]" />
                            )}
                            <span className="font-medium text-[#4b5562]">{mainCategory.name}</span>
                          </div>
                          <span className="text-xs bg-gray-100 text-[#4b5562] px-2 py-1 rounded">
                            {getMainCategoryArticleCount(mainCategoryId)}
                          </span>
                        </button>

                        {expandedMainCategories.has(mainCategoryId) && groupedCategories[mainCategoryId] && (
                          <div className="ml-6 mt-1 space-y-1">
                            <button
                              onClick={() => {
                                setSelectedMainCategoryId(mainCategoryId);
                                setSelectedWikiId(null);
                                setSelectedArticleId(null);
                                setActiveTab(null);
                                updateUrlWithoutArticle();
                              }}
                              className={`cursor-pointer w-full text-left px-4 py-2 rounded text-sm transition ${
                                selectedMainCategoryId === mainCategoryId && !selectedWikiId && !selectedArticleId
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'hover:bg-blue-50 text-[#4b5562] hover:text-blue-600'
                              }`}
                            >
                              All {mainCategory.name} ({getMainCategoryArticleCount(mainCategoryId)})
                            </button>
                            {groupedCategories[mainCategoryId].map((category) => (
                              <button
                                key={category.id}
                                onClick={() => {
                                  setSelectedWikiId(parseInt(category.id));
                                  setSelectedMainCategoryId(mainCategoryId);
                                  setSelectedArticleId(null);
                                  setActiveTab(null);
                                  updateUrlWithoutArticle();
                                }}
                                className={`cursor-pointer w-full text-left px-4 py-2 rounded text-sm transition ${
                                  selectedWikiId === parseInt(category.id) && !selectedArticleId
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'hover:bg-blue-50 text-[#4b5562] hover:text-blue-600'
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
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <nav className="flex justify-between items-end text-md text-[#4b5562]">
                <div className="flex items-center">
                  {getBreadcrumbs().map((breadcrumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                      {breadcrumb.onClick ? (
                        <button
                          onClick={breadcrumb.onClick}
                          className="cursor-pointer hover:text-blue-600 transition truncate max-w-[200px]"
                        >
                          {breadcrumb.label}
                        </button>
                      ) : (
                        <span className="text-[#032646] text-md font-medium truncate max-w-[200px]">
                          {breadcrumb.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  {!selectedArticleId && (
                    <>
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center mb-2 space-x-1">
                          {/* First page button - only show if not near the beginning */}
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
                          
                          {/* Last page button - only show if not near the end */}
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
                      )}
                      
                      {/* Show items count */}
                      <div className="text-end text-sm text-gray-600">
                        {getPaginationText()}
                      </div>
                    </>
                  )}
                  
                </div>
              </nav>
            </div>

            {/* Main content with loading state */}
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
                {/* Article View or Articles List */}
                {selectedArticleId ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    {/* Back Button */}
                    <div className="border-b border-gray-200 p-6 pb-4">
                      <button
                        onClick={handleBackToArticles}
                        className="cursor-pointer flex items-center gap-2 text-[#4b5562] hover:text-blue-600 transition mb-4 font-medium"
                      >
                        <ArrowLeft size={16} />
                        Back to Articles
                      </button>
                    </div>

                    {/* Article Content */}
                    {articleLoading ? (
                      <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                          <Loader2 size={40} className="animate-spin text-[#1f40af] mx-auto mb-4" />
                          <p className="text-[#4b5562]">Loading article...</p>
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
                          <h1 className="text-3xl font-bold text-[#032646] mb-4">
                            {selectedArticle.title}
                          </h1>

                          <div className="flex flex-col items-start gap-4 text-sm text-[#4b5562]">
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
                              <div className="flex gap-2 flex-wrap">
                                {/* Display all categories for this article */}
                                {selectedArticle.category_details?.map((category, index) => (
                                  <div key={category.id} className="flex items-center gap-1">
                                    {category.main_category_id && mainCategories[category.main_category_id] && (
                                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                                        {mainCategories[category.main_category_id].name}
                                      </span>
                                    )}
                                    <span className="bg-gray-100 text-[#4b5562] px-2 py-1 rounded text-xs">
                                      {category.name}
                                    </span>
                                  </div>
                                ))}
                                {/* Fallback for articles without category details */}
                                {(!selectedArticle.category_details || selectedArticle.category_details.length === 0) && (
                                  <span className="bg-gray-100 text-[#4b5562] px-2 py-1 rounded text-xs">
                                    Uncategorized
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tabs or Regular Content */}
                        {selectedArticleMeta?.has_tabs && selectedArticle?.tabs ? (
                          <div>
                            {/* Tab Navigation */}
                            <div ref={tabsContainerRef} className="relative mb-8">
                            {/* Prominent container with background and border */}
                            <div className="bg-gradient-to-br from-[#f3f6f9] to-[#f1f6fe] rounded-lg p-4 border border-[#1f40af] shadow-md">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-blue-800">Article Tabs</h3>
                                  </div>
                                  {needsPagination && getTotalTabPages() > 1 && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                      {Object.keys(selectedArticle.tabs).length} Tabs
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center w-full">
                                {/* Previous Button */}
                                {needsPagination && (
                                  <button
                                    onClick={goToPreviousTabPage}
                                    disabled={!canGoPrevious}
                                    className={`cursor-pointer flex-shrink-0 mr-3 p-2 rounded-lg border-2 transition-all ${
                                      canGoPrevious
                                        ? 'text-blue-600 border-blue-300 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm'
                                        : 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed'
                                    }`}
                                  >
                                    <ChevronLeft size={20} />
                                  </button>
                                )}

                                {/* Tabs Container */}
                                <div className="flex gap-2 flex-1 overflow-hidden">
                                  {getVisibleTabs().map(([tabId, tabContent]) => (
                                    <button
                                      key={tabId}
                                      onClick={() => setActiveTab(tabId)}
                                      className={`cursor-pointer flex-shrink-0 px-5 py-3 text-sm font-bold rounded-lg border-1 transition-all duration-200 whitespace-nowrap max-w-[200px] truncate shadow-md ${
                                        activeTab === tabId
                                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg ring-opacity-50'
                                          : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-500 hover:shadow-lg'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{tabContent.name}</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>

                                {/* Next Button */}
                                {needsPagination && (
                                  <button
                                    onClick={goToNextTabPage}
                                    disabled={!canGoNext}
                                    className={`cursor-pointer flex-shrink-0 ml-3 p-2 rounded-lg border-2 transition-all ${
                                      canGoNext
                                        ? 'text-blue-600 border-blue-300 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm'
                                        : 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed'
                                    }`}
                                  >
                                    <ChevronRight size={20} />
                                  </button>
                                )}
                              </div>

                              {/* Pagination Dots */}
                              {needsPagination && getTotalTabPages() > 1 && (
                                <div className="flex justify-center mt-4">
                                  <div className="flex gap-2">
                                    {Array.from({ length: getTotalTabPages() }, (_, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setCurrentTabPage(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                          index === currentTabPage
                                            ? 'bg-blue-600 ring-2 ring-blue-300'
                                            : 'bg-blue-300 hover:bg-blue-400'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                            {/* Tab Content */}
                            <div className="article-container max-w-none text-[#4b5562] leading-relaxed">
                              {activeTab ? (
                                <div dangerouslySetInnerHTML={{ __html: selectedArticle.tabs[activeTab].content }} />
                              ) : (
                                <p className="text-gray-500">Select a tab to view its content.</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="article-container max-w-none text-[#4b5562] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: selectedArticle?.content }}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    {filteredArticles.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-[#4b5562] text-lg">
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
                      <div className="space-y-6 mb-4">
                        {filteredArticles.map((article) => (
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
                                  <p className="text-sm text-[#4b5562]">
                                    {new Date(article.created_at).toLocaleString([], {
                                      dateStyle: 'medium',
                                      timeStyle: 'short',
                                      hour12: true
                                    })}
                                  </p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {/* Display all categories for this article */}
                                    {article.category_details?.map((category, index) => (
                                      <div key={category.id} className="flex items-center gap-1">
                                        {category.main_category_id && mainCategories[category.main_category_id] && (
                                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-medium">
                                            {mainCategories[category.main_category_id].name}
                                          </span>
                                        )}
                                        <span className="text-xs bg-gray-100 text-[#4b5562] px-2 py-1 rounded">
                                          {category.name}
                                        </span>
                                        {index < article.category_details.length - 1 && (
                                          <span className="text-xs text-gray-400">•</span>
                                        )}
                                      </div>
                                    ))}
                                    {/* Fallback for articles without category details */}
                                    {(!article.category_details || article.category_details.length === 0) && (
                                      <span className="text-xs bg-gray-100 text-[#4b5562] px-2 py-1 rounded">
                                        Uncategorized
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[#4b5562] line-clamp-3">{article.preview}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center mt-4 mb-2 space-x-1">
                          {/* First page button - only show if not near the beginning */}
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
                          
                          {/* Last page button - only show if not near the end */}
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
                      )}
                      
                      {/* Show items count */}
                      <div className="text-end text-sm text-gray-600">
                        {getPaginationText()}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}