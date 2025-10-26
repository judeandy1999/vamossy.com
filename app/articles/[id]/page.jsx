'use client';

import { useState, useEffect } from 'react';
import { useArticleMeta } from '@/hooks/useArticleMeta';
import { useArticleContent } from '@/hooks/useArticleContent';
import Spinner from '@/components/ui/spinner';
import Script from 'next/script';
import { use } from 'react';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/utils/seo';

export default function ArticlePage(props) {
  const params = use(props.params);
  const { data: meta, isLoading: loadingMeta, error: errorMeta } = useArticleMeta(params.id);
  const { data: full, isLoading: loadingContent } = useArticleContent(params.id);

  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (meta?.has_tabs && full?.tabs) {
      const firstTabId = Object.keys(full.tabs)[0];
      setActiveTab(firstTabId);
    }
  }, [meta?.has_tabs, full?.tabs]);

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
    if (!loadingContent && (full?.content || full?.tabs)) {
      setTimeout(makeTablesCollapsible, 100);
    }
  }, [loadingContent, full, activeTab]);

  if (loadingMeta) {
    return <Spinner />
  }

  if (errorMeta) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load article. Please try again.
      </div>
    );
  }

  const hasTabs = meta?.has_tabs && full?.tabs;

  // Generate structured data when meta is available
  const articleSchema = meta ? generateArticleSchema({
    id: params.id,
    title: meta.title,
    created_at: meta.created_at,
    updated_at: meta.updated_at,
    excerpt: full?.excerpt || meta.excerpt,
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
      <article className="w-full max-w-4xl bg-white shadow rounded-lg py-8 px-12 mt-24 mb-12">
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
            {/* Tabs Navigation */}
            <div className="flex gap-2 sm:gap-4 border-b border-gray-200 mb-6">
              {Object.entries(full.tabs).map(([tabId, tabContent]) => (
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
