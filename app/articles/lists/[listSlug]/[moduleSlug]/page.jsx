'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useArticleLists } from '@/hooks/frontend/useArticleLists';
import { useOptionsFrontend } from '@/hooks/useOptionsFrontend';
import { useArticleCountsByListAndWiki } from '@/hooks/frontend/useArticleCountsByListAndWiki';
import Spinner from '@/components/ui/spinner';

export default function ModulePage(props) {
  const params = use(props.params);
  const router = useRouter();
  const [listData, setListData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [wikisInModule, setWikisInModule] = useState([]);
  const [listId, setListId] = useState(null);

  const { articleLists, loading: listsLoading } = useArticleLists();
  const { mainCategories, wikiOptions, loading: optionsLoading } = useOptionsFrontend();
  const { counts, loading: countsLoading } = useArticleCountsByListAndWiki(listId);
  
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Find list and module data
  useEffect(() => {
    if (!articleLists || !mainCategories || !wikiOptions || listsLoading || optionsLoading) {
      return;
    }

    // Find the list
    let foundList = articleLists.find(list => list.id.toString() === params.listSlug);
    if (!foundList) {
      foundList = articleLists.find(list => {
        const slug = createSlug(list.name);
        return slug === params.listSlug;
      });
    }

    // Find the module (main category)
    let foundModule = null;
    let moduleId = null;

    if (params.moduleSlug === 'uncategorized') {
      foundModule = { name: 'Uncategorized', description: 'Articles without a specific category' };
      moduleId = 'uncategorized';
    } else {
      const moduleEntry = Object.entries(mainCategories).find(([id, category]) => {
        const slug = createSlug(category.name);
        return slug === params.moduleSlug;
      });
      
      if (moduleEntry) {
        foundModule = moduleEntry[1];
        moduleId = moduleEntry[0];
      }
    }

    // Find wikis in this module
    const wikis = Object.entries(wikiOptions).filter(([wikiId, wiki]) => {
      if (moduleId === 'uncategorized') {
        return !wiki.main_category_id;
      }
      return wiki.main_category_id?.toString() === moduleId;
    }).map(([wikiId, wiki]) => ({ id: wikiId, ...wiki }));

    setListData(foundList);
    setListId(foundList?.id || null);
    setModuleData(foundModule);
    setWikisInModule(wikis);
  }, [params.listSlug, params.moduleSlug, listsLoading, optionsLoading]);

  const handleWikiClick = (wikiId, wikiName) => {
    const wikiSlug = createSlug(wikiName);
    // Pass the wiki ID in the URL to avoid slug conflicts
    router.push(`/articles/lists/${params.listSlug}/${params.moduleSlug}/${wikiId}-${wikiSlug}`);
  };

  const handleBackClick = () => {
    router.push(`/articles/lists/${params.listSlug}`);
  };

  if (listsLoading || optionsLoading || countsLoading) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 pt-24">
          <div className="flex justify-center items-center py-12">
            <Spinner />
            <span className="ml-3 text-[#4b5562]">Loading module...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!listsLoading && !optionsLoading && (!listData || !moduleData)) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 pt-24">
          <div className="text-center">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-[#032646] mb-2">Module Not Found</h2>
            <p className="text-[#4b5562] mb-6">
              The module "{params.moduleSlug}" could not be found.
            </p>
            <button 
              onClick={() => router.push(`/articles/lists/${params.listSlug}`)}
              className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
            >
              Return to collection
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
              className="cursor-pointer flex items-center gap-2 text-[#4b5562] hover:text-blue-600 transition font-medium bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to {listData.name}
            </button>
          </div>

          <nav className="flex items-center gap-2 text-sm text-[#4b5562] mb-4">
            <button
              onClick={() => router.push('/articles')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Collections
            </button>
            <span>/</span>
            <button
              onClick={() => router.push(`/articles/lists/${params.listSlug}`)}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {listData.name}
            </button>
            <span>/</span>
            <span className="text-[#032646] font-medium">{moduleData.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-[#032646] mb-2">
            {moduleData.name}
          </h1>
          
          {moduleData.description && (
            <p className="text-lg text-[#4b5562]">
              {moduleData.description}
            </p>
          )}
        </div>

        {/* Wikis */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#032646] mb-4">Choose a Wiki</h2>
          
          {wikisInModule.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-[#4b5562] text-lg">
                No wikis available in this module
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wikisInModule.map((wiki) => {
                const articleCount = counts?.byWikiId?.[wiki.id] || 0;
                
                return (
                  <button
                    key={wiki.id}
                    onClick={() => handleWikiClick(wiki.id, wiki.name)}
                    className="text-left p-6 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition group shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#032646] group-hover:text-blue-600">
                            {wiki.name}
                          </h3>
                          <span className="text-sm bg-gray-100 text-[#4b5562] px-2 py-1 rounded-full">
                            {articleCount} article{articleCount === 1 ? '' : 's'}
                          </span>
                        </div>
                        {wiki.description && (
                          <p className="text-sm text-[#4b5562]">
                            {wiki.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 ml-4 flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}