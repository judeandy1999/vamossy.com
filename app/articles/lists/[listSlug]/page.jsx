// Move app/articles/[listSlug]/page.jsx to app/articles/lists/[listSlug]/page.jsx
// filepath: app/articles/lists/[listSlug]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { useArticleLists } from '@/hooks/frontend/useArticleLists';
import { useOptionsFrontend } from '@/hooks/useOptionsFrontend';
import { useArticleCountsByListAndWiki } from '@/hooks/frontend/useArticleCountsByListAndWiki';
import Spinner from '@/components/ui/spinner';

export default function ArticleListPage(props) {
  const params = use(props.params);
  const router = useRouter();
  const [listData, setListData] = useState(null);
  const [listId, setListId] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());

  const { articleLists, loading: listsLoading, error: listsError } = useArticleLists();
  const { mainCategories, wikiOptions, loading: optionsLoading } = useOptionsFrontend();
  const { counts, loading: countsLoading } = useArticleCountsByListAndWiki(listId);
  
  // Create slug function
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Find list when articleLists or params change
  useEffect(() => {
    if (!articleLists || articleLists.length === 0 || !params.listSlug || listsLoading) {
      return;
    }

    // Try to find by ID first
    let foundList = articleLists.find(list => list.id.toString() === params.listSlug);
    
    if (!foundList) {
      // Create slug from name and try to match
      foundList = articleLists.find(list => {
        const slug = createSlug(list.name);
        return slug === params.listSlug;
      });
    }

    if (foundList) {
      setListData(foundList);
      setListId(foundList.id);
    } else {
      setListData(null);
      setListId(null);
    }
  }, [params.listSlug, listsLoading]);

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleWikiClick = (moduleId, moduleName, wikiId, wikiName) => {
    const moduleSlug = createSlug(moduleName);
    const wikiSlug = createSlug(wikiName);
    // Pass the wiki ID in the URL to avoid slug conflicts
    router.push(`/articles/lists/${params.listSlug}/${moduleSlug}/${wikiId}-${wikiSlug}`);
  };

  const handleBackClick = () => {
    router.push('/articles');
  };

  // Group wikis by main category (modules)
  const groupedWikis = Object.entries(wikiOptions || {}).reduce((acc, [wikiId, wiki]) => {
    const mainCategoryId = wiki.main_category_id || 'uncategorized';
    if (!acc[mainCategoryId]) {
      acc[mainCategoryId] = [];
    }
    acc[mainCategoryId].push({ id: wikiId, ...wiki });
    return acc;
  }, {});

  // Calculate total articles count for each module
  const getModuleArticleCount = (moduleId) => {
    if (!groupedWikis[moduleId] || !counts?.byWikiId) return 0;
    
    return groupedWikis[moduleId].reduce((total, wiki) => {
      return total + (counts.byWikiId[wiki.id] || 0);
    }, 0);
  };

  // Handle loading states
  if (listsLoading || optionsLoading || countsLoading) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 pt-24">
          <div className="flex justify-center items-center py-12">
            <Spinner />
            <span className="ml-3 text-[#4b5562]">Loading collection...</span>
          </div>
        </div>
      </div>
    );
  }

  // Handle list not found
  if (!listsLoading && !listData) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 pt-24">
          <div className="text-center">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-[#032646] mb-2">Collection Not Found</h2>
            <p className="text-[#4b5562] mb-6">
              The collection "{params.listSlug}" could not be found.
            </p>
            <button 
              onClick={() => router.push('/articles')}
              className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
            >
              Return to article collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-[#4b5562] hover:text-blue-600 transition font-medium bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Collections
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#032646] mb-2">
            {listData?.name}
          </h1>
          
          {listData?.description && (
            <p className="text-lg text-[#4b5562]">
              {listData.description}
            </p>
          )}
        </div>

        {/* Modules (Main Categories) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#032646] mb-4">Browse by Module</h2>
          
          {Object.keys(groupedWikis).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-[#4b5562] text-lg">
                No modules available in this collection
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Uncategorized Module */}
              {/* {groupedWikis['uncategorized'] && (
                <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
                  <button
                    onClick={() => toggleModule('uncategorized')}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {expandedModules.has('uncategorized') ? (
                        <ChevronDown size={20} className="text-[#4b5562]" />
                      ) : (
                        <ChevronRight size={20} className="text-[#4b5562]" />
                      )}
                      <h3 className="text-lg font-semibold text-[#032646]">Uncategorized</h3>
                    </div>
                    <span className="text-sm bg-gray-100 text-[#4b5562] px-3 py-1 rounded">
                      {groupedWikis['uncategorized'].length} wiki{groupedWikis['uncategorized'].length === 1 ? '' : 's'}
                    </span>
                  </button>

                  {expandedModules.has('uncategorized') && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="px-6 py-4 space-y-2">
                        {groupedWikis['uncategorized'].map((wiki) => (
                          <button
                            key={wiki.id}
                            onClick={() => handleWikiClick('uncategorized', 'Uncategorized', wiki.id, wiki.name)}
                            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-[#032646] group-hover:text-blue-600">{wiki.name}</h4>
                                {wiki.description && (
                                  <p className="text-sm text-[#4b5562] mt-1">{wiki.description}</p>
                                )}
                              </div>
                              <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )} */}

              {/* Categorized Modules */}
              {Object.entries(mainCategories || {}).map(([moduleId, module]) => {
                if (!groupedWikis[moduleId]) return null;
                
                const moduleArticleCount = getModuleArticleCount(moduleId);
                
                return (
                  <div key={moduleId} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                    <button
                      onClick={() => toggleModule(moduleId)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules.has(moduleId) ? (
                          <ChevronDown size={20} className="text-[#4b5562]" />
                        ) : (
                          <ChevronRight size={20} className="text-[#4b5562]" />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-[#032646]">{module.name}</h3>
                          {module.description && (
                            <p className="text-sm text-[#4b5562] mt-1">{module.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {moduleArticleCount} article{moduleArticleCount === 1 ? '' : 's'}
                        </span>
                        <span className="text-sm bg-gray-100 text-[#4b5562] px-3 py-1 rounded">
                          {groupedWikis[moduleId].length} wiki{groupedWikis[moduleId].length === 1 ? '' : 's'}
                        </span>
                      </div>
                    </button>

                    {expandedModules.has(moduleId) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="px-6 py-4 space-y-2">
                          {groupedWikis[moduleId].map((wiki) => {
                            const wikiArticleCount = counts?.byWikiId?.[wiki.id] || 0;
                            
                            return (
                              <button
                                key={wiki.id}
                                onClick={() => handleWikiClick(moduleId, module.name, wiki.id, wiki.name)}
                                className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition group cursor-pointer"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium text-[#032646] group-hover:text-blue-600">{wiki.name}</h4>
                                      <span className="text-xs bg-gray-100 text-[#4b5562] px-2 py-1 rounded-full">
                                        {wikiArticleCount} article{wikiArticleCount === 1 ? '' : 's'}
                                      </span>
                                    </div>
                                    {wiki.description && (
                                      <p className="text-sm text-[#4b5562] mt-1">{wiki.description}</p>
                                    )}
                                  </div>
                                  <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 ml-4 flex-shrink-0" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}