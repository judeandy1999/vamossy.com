'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useArticleLists } from '@/hooks/frontend/useArticleLists';
import { useOptionsFrontend } from '@/hooks/useOptionsFrontend';
import { useArticlesByListAndWiki } from '@/hooks/frontend/useArticlesByListAndWiki';
import ArticlesDisplay from '@/components/articles/articles-display';
import Spinner from '@/components/ui/spinner';

export default function WikiArticlesPage(props) {
  const params = use(props.params);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [listId, setListId] = useState(null);
  const [wikiId, setWikiId] = useState(null);

  const { articleLists, loading: listsLoading } = useArticleLists();
  const { mainCategories, wikiOptions, loading: optionsLoading } = useOptionsFrontend();
  
  const { 
    articles, 
    loading: articlesLoading, 
    error: articlesError, 
    totalPages, 
    totalCount, 
    hasNextPage, 
    hasPrevPage 
  } = useArticlesByListAndWiki(listId, wikiId, currentPage);

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Find list, module, and wiki data
  useEffect(() => {
    if (!articleLists || !wikiOptions || listsLoading || optionsLoading) {
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

    // Find the module
    let foundModule = null;
    let moduleId = null;

    if (params.moduleSlug === 'uncategorized') {
      foundModule = { name: 'Uncategorized', description: 'Articles without a specific category' };
      moduleId = 'uncategorized';
    } else if (mainCategories) {
      const moduleEntry = Object.entries(mainCategories).find(([id, category]) => {
        const slug = createSlug(category.name);
        return slug === params.moduleSlug;
      });
      
      if (moduleEntry) {
        foundModule = moduleEntry[1];
        moduleId = moduleEntry[0];
      }
    }

    // Find the wiki
    let foundWiki = null;
    let foundWikiId = null;

    // Extract wiki ID from the URL parameter (format: "id-slug")
    const wikiSlugParam = params.wikiSlug;
    const idMatch = wikiSlugParam.match(/^(\d+)-/);
    
    if (idMatch) {
      // ID is embedded in the URL parameter
      foundWikiId = idMatch[1];
      foundWiki = wikiOptions[foundWikiId];
    } else {
      // Fallback to slug-based lookup for backward compatibility
      const wikiEntry = Object.entries(wikiOptions).find(([id, wiki]) => {
        const slug = createSlug(wiki.name);
        return slug === params.wikiSlug;
      });

      if (wikiEntry) {
        foundWikiId = wikiEntry[0];
        foundWiki = wikiEntry[1];
        console.log('Wiki found by slug fallback:', { 
          wikiSlugParam, 
          foundId: foundWikiId, 
          foundWiki: foundWiki?.name 
        });
      }
    }

    setListData(foundList);
    setModuleData(foundModule);
    setWikiData(foundWiki);
    setListId(foundList?.id || null);
    setWikiId(foundWikiId);
  }, [params.listSlug, params.moduleSlug, params.wikiSlug, listsLoading, optionsLoading]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    router.push(`/articles/lists/${params.listSlug}/${params.moduleSlug}`);
  };

  // Custom back button path for individual article pages
  const backButtonPath = `/articles/lists/${params.listSlug}/${params.moduleSlug}/${params.wikiSlug}`;

  if (listsLoading || optionsLoading) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 pt-24">
          <div className="flex justify-center items-center py-12">
            <Spinner />
            <span className="ml-3 text-[#4b5562]">Loading wiki...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!listsLoading && !optionsLoading && (!listData || !moduleData || !wikiData)) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#032646] mb-2">Wiki Not Found</h2>
            <p className="text-[#4b5562] mb-6">
              The wiki "{params.wikiSlug}" could not be found.
            </p>
            <button 
              onClick={() => router.push(`/articles/lists/${params.listSlug}/${params.moduleSlug}`)}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Return to module
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
              className="cursor-pointer flex items-center gap-2 text-[#4b5562] hover:text-blue-600 transition font-medium bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to {moduleData.name}
            </button>
          </div>

          <nav className="flex items-center gap-2 text-sm text-[#4b5562] mb-4">
            <button
              onClick={() => router.push('/articles')}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              Collections
            </button>
            <span>/</span>
            <button
              onClick={() => router.push(`/articles/lists/${params.listSlug}`)}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              {listData.name}
            </button>
            <span>/</span>
            <button
              onClick={() => router.push(`/articles/lists/${params.listSlug}/${params.moduleSlug}`)}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              {moduleData.name}
            </button>
            <span>/</span>
            <span className="text-[#032646] font-medium">{wikiData.name}</span>
          </nav>
        </div>

        {/* Articles Display */}
        <ArticlesDisplay
          articles={articles}
          loading={articlesLoading}
          error={articlesError}
          totalPages={totalPages}
          totalCount={totalCount}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={handlePageChange}
          listName={`${wikiData.name} Articles`}
          listDescription={wikiData.description || `Articles from the ${wikiData.name} wiki in ${moduleData.name}`}
          showBackButton={true}
          backButtonPath={backButtonPath}
          backButtonText={`Back to ${moduleData.name}`}
          onBackClick={handleBackClick}
        />
      </div>
    </div>
  );
}