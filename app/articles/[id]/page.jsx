// app/articles/[id]/page.jsx
'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useArticleContent } from '@/hooks/useArticleContent';
import { useArticleMeta } from '@/hooks/useArticleMeta';
import Spinner from '@/components/ui/spinner';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/utils/seo';
import Script from 'next/script';
import { useState, useEffect, useRef } from 'react';

export default function ArticlePage(props) {
  const params = use(props.params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentTabPage, setCurrentTabPage] = useState(0);
  const [tabsPerPage, setTabsPerPage] = useState(5);
  
  // Refs
  const tabsContainerRef = useRef(null);

  const { data: meta, loading: metaLoading, error: metaError } = useArticleMeta(params.id);
  const { data: full, loading: fullLoading, error: fullError } = useArticleContent(params.id);

  // Set first tab as active when content loads
  useEffect(() => {
    if (full?.tabs && Object.keys(full.tabs).length > 0 && !activeTab) {
      const firstTabId = Object.keys(full.tabs)[0];
      setActiveTab(firstTabId);
    }
  }, [full, activeTab]);

  // Handle loading state with delay
  useEffect(() => {
    if (fullLoading) {
      const timer = setTimeout(() => setLoadingContent(true), 200);
      return () => clearTimeout(timer);
    } else {
      setLoadingContent(false);
    }
  }, [fullLoading]);

  // Reset tab page when new article loads
  useEffect(() => {
    setCurrentTabPage(0);
  }, [params.id]);

  // Tab helper functions
  const getSortedTabs = () => {
    if (!full?.tabs) return [];
    return Object.entries(full.tabs).sort((a, b) => {
      const orderA = a[1].order || 999;
      const orderB = b[1].order || 999;
      return orderA - orderB;
    });
  };

  const getVisibleTabs = () => {
    if (!full?.tabs) return [];
    const sortedTabs = getSortedTabs();
    const startIndex = currentTabPage * tabsPerPage;
    const endIndex = startIndex + tabsPerPage;
    return sortedTabs.slice(startIndex, endIndex);
  };

  const getTotalTabPages = () => {
    if (!full?.tabs) return 0;
    return Math.ceil(Object.keys(full.tabs).length / tabsPerPage);
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
  const needsPagination = full?.tabs && Object.keys(full.tabs).length > tabsPerPage;

  // Get back path from query params or default
  const getBackPath = () => {
    const backPath = searchParams.get('back');
    if (backPath) {
      return decodeURIComponent(backPath);
    }
    return '/articles';
  };

  const handleBackClick = () => {
    router.push(getBackPath());
  };

  const hasTabs = meta?.has_tabs && full?.tabs && Object.keys(full.tabs).length > 0;

  if (metaLoading || fullLoading) {
    return <Spinner />;
  }

  if (metaError || !meta) {
    return <Spinner />;
  }

  // Generate structured data
  const articleSchema = full ? generateArticleSchema({
    id: params.id,
    title: meta.title,
    content: full.content,
    createdAt: meta.created_at,
    updatedAt: meta.updated_at,
    summary: full?.summary || meta.summary
  }) : null;

  const breadcrumbSchema = meta ? generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Articles", url: "/articles" },
    { name: meta.title, url: `/articles/${params.id}` }
  ]) : null;

  return (
    <>
      {/* Structured Data */}
      {articleSchema && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      {breadcrumbSchema && (
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      
    <div className="pt-12 bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-4xl px-4 mb-6">
        <button
          onClick={handleBackClick}
          className="cursor-pointer flex items-center gap-2 text-[#4b5562] hover:text-blue-600 transition font-medium bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <article className="w-full max-w-4xl bg-white shadow rounded-lg py-8 px-12 mt-8 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">{meta.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {new Date(meta.created_at).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
            hour12: true
          })}
        </p>

        {loadingContent ? (
          <div className="flex justify-center items-center my-12 text-teal-600">
            <Spinner />
          </div>
        ) : hasTabs ? (
          <div>
            {/* Enhanced Tabs Navigation */}
            <div className="bg-gradient-to-br from-[#f3f6f9] to-[#f1f6fe] rounded-lg p-4 border border-[#1f40af] shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-blue-800">Article Tabs</h3>
                  </div>
                  {needsPagination && getTotalTabPages() > 1 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {Object.keys(full.tabs).length} Tabs
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
                <div className="flex gap-2 flex-1 overflow-hidden" ref={tabsContainerRef}>
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

            {/* Tab Content */}
            <div className="article-container max-w-none text-gray-800 leading-relaxed">
              {activeTab ? (
                <div dangerouslySetInnerHTML={{ __html: full.tabs[activeTab].content }} />
              ) : (
                <p className="text-gray-500">Select a tab to view its content.</p>
              )}
            </div>
          </div>
        ) : (
          <div
            className="article-container max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: full?.content }}
          />
        )}
      </article>
    </div>
    </>
  );
}