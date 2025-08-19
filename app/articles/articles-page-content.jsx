'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, ArrowLeft, Calendar, Tag, Loader2, ChevronLeft } from 'lucide-react';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useOptions } from '@/hooks/useOptions';
import { useArticleContent } from '@/hooks/useArticleContent';
import { useArticleMeta } from '@/hooks/useArticleMeta';

export default function ArticlesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { articles, loading, error, loadMore, isReachingEnd } = useAllArticles();
  const { wikiOptions, mainCategories, loading: optionsLoading } = useOptions();
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [selectedWikiId, setSelectedWikiId] = useState(null);
  const [expandedMainCategories, setExpandedMainCategories] = useState(new Set());
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  
  // Tab navigation states
  const [currentTabPage, setCurrentTabPage] = useState(0);
  const [tabsPerPage, setTabsPerPage] = useState(5);
  const tabsContainerRef = useRef(null);

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };
  
  // Initialize selectedArticleId from URL on component mount
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelectedArticleId(parseInt(id));
    }
  }, [searchParams]);
  
  // Fetch article content when an article is selected
  const { data: selectedArticle, loading: articleLoading, error: articleError } = useArticleContent(selectedArticleId);
  const { data: selectedArticleMeta } = useArticleMeta(selectedArticleId);

  // Helper function to get sorted tabs
  const getSortedTabs = () => {
    if (!selectedArticle?.tabs) return [];
    return Object.entries(selectedArticle.tabs).sort((a, b) => {
      const orderA = a[1].order || 999;
      const orderB = b[1].order || 999;
      return orderA - orderB;
    });
  };

  // Add useEffect for tab management
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

  // Calculate how many tabs can fit based on container width
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

  // Add this useEffect for collapsible tables
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

  // Early returns should come AFTER all hooks
  if (error) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            <p className="text-lg mb-2">Failed to load articles</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || optionsLoading) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 size={40} className="animate-spin text-[#025965] mx-auto mb-4" />
              <p className="text-[#3A3A3A]">Loading articles...</p>
            </div>
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

  // Filter articles based on selections
  const getFilteredArticles = () => {
    if (selectedWikiId) {
      return articles.filter(article => article.wiki_id === selectedWikiId);
    }
    if (selectedMainCategoryId === 'uncategorized') {
      const uncategorizedWikiIds = groupedCategories['uncategorized']?.map(cat => parseInt(cat.id)) || [];
      return articles.filter(article => uncategorizedWikiIds.includes(article.wiki_id));
    }
    if (selectedMainCategoryId) {
      const categoryWikiIds = groupedCategories[selectedMainCategoryId]?.map(cat => parseInt(cat.id)) || [];
      return articles.filter(article => categoryWikiIds.includes(article.wiki_id));
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
      const uncategorizedWikiIds = groupedCategories['uncategorized']?.map(cat => parseInt(cat.id)) || [];
      return articles.filter(article => uncategorizedWikiIds.includes(article.wiki_id)).length;
    }
    const categoryWikiIds = groupedCategories[mainCategoryId]?.map(cat => parseInt(cat.id)) || [];
    return articles.filter(article => categoryWikiIds.includes(article.wiki_id)).length;
  };

  // Tab navigation functions
  const getVisibleTabs = () => {
    const sortedTabs = getSortedTabs();
    const startIndex = currentTabPage * tabsPerPage;
    return sortedTabs.slice(startIndex, startIndex + tabsPerPage);
  };

  const getTotalPages = () => {
    const sortedTabs = getSortedTabs();
    return Math.ceil(sortedTabs.length / tabsPerPage);
  };

  const goToPreviousPage = () => {
    if (currentTabPage > 0) {
      setCurrentTabPage(currentTabPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentTabPage < getTotalPages() - 1) {
      setCurrentTabPage(currentTabPage + 1);
    }
  };

  const canGoPrevious = currentTabPage > 0;
  const canGoNext = currentTabPage < getTotalPages() - 1;
  const needsPagination = selectedArticle?.tabs && Object.keys(selectedArticle.tabs).length > tabsPerPage;

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-[#222222] mb-8">
          {getPageTitle()}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-[#222222] mb-4">Browse Categories</h2>
              
              {/* All Articles Button */}
              <button
                onClick={() => {
                  setSelectedMainCategoryId(null);
                  setSelectedWikiId(null);
                  setSelectedArticleId(null);
                  setActiveTab(null);
                  updateUrlWithoutArticle();
                }}
                className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg mb-3 transition ${
                  !selectedMainCategoryId && !selectedWikiId && !selectedArticleId
                    ? 'bg-[#025965] text-white'
                    : 'hover:bg-gray-50 text-[#3A3A3A]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">All Articles</span>
                  <span className="text-xs bg-gray-100 text-[#3A3A3A] px-2 py-1 rounded">
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
                        <span className="font-medium text-[#3A3A3A]">Uncategorized</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-[#3A3A3A] px-2 py-1 rounded">
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
                          className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                            selectedMainCategoryId === 'uncategorized' && !selectedWikiId && !selectedArticleId
                              ? 'bg-gray-100 text-[#025965] font-medium'
                              : 'hover:bg-gray-50 text-[#3A3A3A]'
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
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                              selectedWikiId === parseInt(category.id) && !selectedArticleId
                                ? 'bg-gray-100 text-[#025965] font-medium'
                                : 'hover:bg-gray-50 text-[#3A3A3A]'
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
                      className="cursor-pointer w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="flex items-center gap-2">
                        {expandedMainCategories.has(mainCategoryId) ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                        <span className="font-medium text-[#3A3A3A]">{mainCategory.name}</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-[#3A3A3A] px-2 py-1 rounded">
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
                          className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                            selectedMainCategoryId === mainCategoryId && !selectedWikiId && !selectedArticleId
                              ? 'bg-gray-100 text-[#025965] font-medium'
                              : 'hover:bg-gray-50 text-[#3A3A3A]'
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
                            className={`cursor-pointer w-full text-left px-3 py-2 rounded text-sm transition ${
                              selectedWikiId === parseInt(category.id) && !selectedArticleId
                                ? 'bg-gray-100 text-[#025965] font-medium'
                                : 'hover:bg-gray-50 text-[#3A3A3A]'
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
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <nav className="flex items-center text-sm text-[#3A3A3A]">
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {breadcrumb.onClick ? (
                      <button
                        onClick={breadcrumb.onClick}
                        className="cursor-pointer hover:text-[#025965] transition truncate max-w-[200px]"
                      >
                        {breadcrumb.label}
                      </button>
                    ) : (
                      <span className="text-[#222222] font-medium truncate max-w-[200px]">
                        {breadcrumb.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Article View or Articles List */}
            {selectedArticleId ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Back Button */}
                <div className="border-b border-gray-200 p-6 pb-4">
                  <button
                    onClick={handleBackToArticles}
                    className="cursor-pointer flex items-center gap-2 text-[#3A3A3A] hover:text-[#025965] transition mb-4"
                  >
                    <ArrowLeft size={16} />
                    Back to Articles
                  </button>
                </div>

                {/* Article Content */}
                {articleLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                      <Loader2 size={40} className="animate-spin text-[#025965] mx-auto mb-4" />
                      <p className="text-[#3A3A3A]">Loading article...</p>
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
                      <h1 className="text-3xl font-bold text-[#222222] mb-4">
                        {selectedArticle.title}
                      </h1>
                      
                      <div className="flex items-center gap-4 text-sm text-[#3A3A3A]">
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
                              <span className="bg-[#B5C9B8] text-[#025965] px-2 py-1 rounded text-xs">
                                {mainCategories[wikiOptions[selectedArticle.wiki_id].main_category_id]?.name}
                              </span>
                            )}
                            <span className="bg-gray-100 text-[#3A3A3A] px-2 py-1 rounded text-xs">
                              {wikiOptions[selectedArticle.wiki_id]?.name || 'Unknown Category'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabs or Regular Content */}
                    {selectedArticleMeta?.has_tabs && selectedArticle?.tabs ? (
                      <div>
                        {/* Tab Navigation */}
                        <div ref={tabsContainerRef} className="relative mb-6">
                          <div className="flex items-center border-b border-gray-200 w-full">
                            {/* Previous Button */}
                            {needsPagination && (
                              <button
                                onClick={goToPreviousPage}
                                disabled={!canGoPrevious}
                                className={`cursor-pointer flex-shrink-0 mr-2 p-2 rounded-lg transition-all ${
                                  canGoPrevious
                                    ? 'text-[#025965] hover:text-[#548816] hover:bg-gray-100'
                                    : 'text-gray-300 !cursor-not-allowed'
                                }`}
                                title="Previous tabs"
                              >
                                <ChevronLeft size={20} />
                              </button>
                            )}

                            {/* Tabs */}
                            <div className="flex gap-1 sm:gap-2 flex-1 min-w-0 overflow-hidden">
                              {getVisibleTabs().map(([tabId, tabContent]) => (
                                <button
                                  key={tabId}
                                  onClick={() => setActiveTab(tabId)}
                                  className={`cursor-pointer flex-shrink-0 px-3 py-2 text-xs sm:text-sm font-medium rounded-t transition focus:outline-none whitespace-nowrap max-w-[200px] truncate ${
                                    activeTab === tabId
                                      ? 'bg-gray-100 text-[#025965] border-b-2 border-[#025965]'
                                      : 'text-[#3A3A3A] hover:text-[#025965]'
                                  }`}
                                  title={tabContent.name}
                                >
                                  {tabContent.name}
                                </button>
                              ))}
                            </div>

                            {/* Next Button */}
                            {needsPagination && (
                              <button
                                onClick={goToNextPage}
                                disabled={!canGoNext}
                                className={`cursor-pointer flex-shrink-0 ml-2 p-2 rounded-lg transition-all ${
                                  canGoNext
                                    ? 'text-[#025965] hover:text-[#548816] hover:bg-gray-100'
                                    : 'text-gray-300 !cursor-not-allowed'
                                }`}
                                title="Next tabs"
                              >
                                <ChevronRight size={20} />
                              </button>
                            )}
                          </div>

                          {/* Pagination Dots */}
                          {needsPagination && getTotalPages() > 1 && (
                            <div className="absolute right-0 top-full mt-2">
                              <div className="flex gap-1">
                                {Array.from({ length: getTotalPages() }, (_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentTabPage(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                      index === currentTabPage
                                        ? 'bg-[#025965]'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    title={`Page ${index + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tab Content */}
                        <div className="article-container max-w-none text-[#3A3A3A] leading-relaxed">
                          {activeTab ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedArticle.tabs[activeTab].content }} />
                          ) : (
                            <p className="text-gray-500">Select a tab to view its content.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="article-container max-w-none text-[#3A3A3A] leading-relaxed"
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
                    <p className="text-[#3A3A3A] text-lg">
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
                            <h3 className="text-xl font-semibold text-[#222222] hover:text-[#025965] transition mb-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-4 mb-3">
                              <p className="text-sm text-[#3A3A3A]">
                                {new Date(article.created_at).toLocaleString([], {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                  hour12: true
                                })}
                              </p>
                              <div className="flex items-center gap-2">
                                {wikiOptions[article.wiki_id]?.main_category_id && (
                                  <span className="text-xs bg-[#B5C9B8] text-[#025965] px-2 py-1 rounded">
                                    {mainCategories[wikiOptions[article.wiki_id].main_category_id]?.name}
                                  </span>
                                )}
                                <span className="text-xs bg-gray-100 text-[#3A3A3A] px-2 py-1 rounded">
                                  {wikiOptions[article.wiki_id]?.name || 'Unknown Category'}
                                </span>
                              </div>
                            </div>
                            <p className="text-[#3A3A3A] line-clamp-3">{article.preview}</p>
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
                      className="cursor-pointer px-6 py-3 bg-[#025965] text-white rounded-lg hover:bg-[#548816] transition flex items-center gap-2"
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