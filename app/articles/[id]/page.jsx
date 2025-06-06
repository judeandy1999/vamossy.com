'use client';

import { useState, useEffect } from 'react';
import { useArticleMeta } from '@/hooks/useArticleMeta';
import { useArticleContent } from '@/hooks/useArticleContent';
import Spinner from '@/components/ui/spinner';
import { use } from 'react';

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

  return (
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
  );
}
