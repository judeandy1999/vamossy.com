import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';

export const useOptions = () => {
  const [wikiOptions, setWikiOptions] = useState({});
  const [tabOptionsMap, setTabOptionsMap] = useState({});
  const [mainCategories, setMainCategories] = useState({});
  const [articleLists, setArticleLists] = useState({}); // Add this line
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch article lists
        const articleListsResponse = await fetch('/api/article-lists', {
          headers: {
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
        });
        const articleListsData = await articleListsResponse.json();
        if (!articleListsResponse.ok) throw new Error(articleListsData.error || 'Failed to fetch article lists');

        // Fetch main categories
        const mainCategoriesResponse = await fetch('/api/main-categories', {
          headers: {
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
        });
        const mainCategoriesData = await mainCategoriesResponse.json();
        if (!mainCategoriesResponse.ok) throw new Error(mainCategoriesData.error || 'Failed to fetch main categories');

        // Fetch wiki options
        const wikiResponse = await fetch('/api/wiki-options', {
          headers: {
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
        });
        const wikiData = await wikiResponse.json();
        if (!wikiResponse.ok) throw new Error(wikiData.error || 'Failed to fetch wiki options');

        // Fetch tab options
        const tabResponse = await fetch('/api/tab-options', {
          headers: {
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
        });
        const tabJson = await tabResponse.json();
        if (!tabResponse.ok) throw new Error(tabJson.error || 'Failed to fetch tab options');
        const tabData = tabJson.data || [];

        // Format main categories
        const formattedMainCategories = mainCategoriesData.reduce((acc, category) => {
          acc[category.id] = {
            name: category.name,
            description: category.description || ''
          };
          return acc;
        }, {});

        // Format wiki options
        const formattedWikiOptions = wikiData.reduce((acc, wiki) => {
          acc[wiki.id] = {
            name: wiki.name,
            description: wiki.description || '',
            main_category_id: wiki.main_category_id
          };
          return acc;
        }, {});

        // Format tab options
        const formattedTabOptionsMap = tabData.reduce((acc, tab) => {
          if (!acc[tab.wiki_id]) acc[tab.wiki_id] = {};
          acc[tab.wiki_id][tab.id] = {
            name: tab.name,
            description: tab.description || ''
          };
          return acc;
        }, {});

        // Format article lists
        const formattedArticleLists = articleListsData.reduce((acc, list) => {
          acc[list.id] = {
            name: list.name,
            description: list.description || ''
          };
          return acc;
        }, {});

        setMainCategories(formattedMainCategories);
        setWikiOptions(formattedWikiOptions);
        setTabOptionsMap(formattedTabOptionsMap);
        setArticleLists(formattedArticleLists);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const addMainCategory = async (newMainCategory) => {
    try {

      const response = await fetch('/api/main-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(newMainCategory),
      });

      if (!response.ok) throw new Error('Failed to add main category');

      const addedMainCategory = await response.json();
      setMainCategories((prev) => ({ 
        ...prev, 
        [addedMainCategory[0].id]: {
          name: addedMainCategory[0].name,
          description: addedMainCategory[0].description || ''
        }
      }));
      
      return addedMainCategory[0];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMainCategory = async (id, updatedMainCategory) => {
    try {

      const response = await fetch(`/api/main-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(updatedMainCategory),
      });

      if (!response.ok) throw new Error('Failed to update main category');

      const updated = await response.json();
      setMainCategories((prev) => ({
        ...prev,
        [id]: {
          name: updated[0].name,
          description: updated[0].description || ''
        }
      }));
      
      return updated[0];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMainCategory = async (id) => {
    try {

      const response = await fetch(`/api/main-categories/${id}`, {
        method: 'DELETE',
        headers: {
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!response.ok) throw new Error('Failed to delete main category');

      setMainCategories((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      // Update any wikis that were assigned to this main category
      setWikiOptions((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach(wikiId => {
          if (updated[wikiId].main_category_id === id) {
            updated[wikiId] = { ...updated[wikiId], main_category_id: null };
          }
        });
        return updated;
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addWiki = async (newWiki) => {
    try {

      const response = await fetch('/api/wiki-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(newWiki),
      });

      if (!response.ok) throw new Error('Failed to add wiki');

      const addedWiki = await response.json();
      setWikiOptions((prev) => ({ 
        ...prev, 
        [addedWiki[0].id]: {
          name: addedWiki[0].name,
          description: addedWiki[0].description || '',
          main_category_id: addedWiki[0].main_category_id
        }
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateWiki = async (id, updatedWiki) => {
    try {

      const response = await fetch(`/api/wiki-options/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(updatedWiki),
      });

      if (!response.ok) throw new Error('Failed to update category');

      const updated = await response.json();
      setWikiOptions((prev) => ({
        ...prev,
        [id]: {
          name: updated.name,
          description: updated.description || '',
          main_category_id: updated.main_category_id
        }
      }));
      
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateWikiMainCategory = async (wikiId, mainCategoryId) => {
    try {

      const response = await fetch(`/api/wiki-options/${wikiId}/main-category`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({ main_category_id: mainCategoryId }),
      });

      if (!response.ok) throw new Error('Failed to update wiki main category');

      const updatedWiki = await response.json();
      setWikiOptions((prev) => ({
        ...prev,
        [wikiId]: {
          ...prev[wikiId],
          main_category_id: updatedWiki.main_category_id
        }
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addTab = async (newTab) => {
    try {

      const response = await fetch('/api/tab-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(newTab),
      });

      if (!response.ok) throw new Error('Failed to add tab');

      const addedTabJson = await response.json();
      const addedTab = addedTabJson.data || [];
      setTabOptionsMap((prev) => ({
        ...prev,
        [newTab.wiki_id]: {
          ...prev[newTab.wiki_id],
          [addedTab[0].id]: {
            name: addedTab[0].name,
            description: addedTab[0].description || ''
          }
        },
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTab = async (id, updatedTab) => {
    try {

      const response = await fetch(`/api/tab-options/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(updatedTab),
      });

      if (!response.ok) throw new Error('Failed to update tab');

      const responseData = await response.json();
      const updated = responseData.data || responseData;
      
      // Find which wiki this tab belongs to
      let targetWikiId = null;
      Object.entries(tabOptionsMap).forEach(([wikiId, tabs]) => {
        if (tabs[id]) {
          targetWikiId = wikiId;
        }
      });

      if (targetWikiId) {
        setTabOptionsMap((prev) => ({
          ...prev,
          [targetWikiId]: {
            ...prev[targetWikiId],
            [id]: {
              name: updated.name,
              description: updated.description || ''
            }
          }
        }));
      }
      
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteWiki = async (wikiId) => {
    try {

      const response = await fetch(`/api/wiki-options/${wikiId}`, {
        method: 'DELETE',
        headers: {
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete wiki with ID ${wikiId}`);
      }

      setWikiOptions((prev) => {
        const updated = { ...prev };
        delete updated[wikiId];
        return updated;
      });

      setTabOptionsMap((prev) => {
        const updated = { ...prev };
        delete updated[wikiId];
        return updated;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteTab = async (tabId, wikiId) => {
    try {

      const response = await fetch(`/api/tab-options/${tabId}`, {
        method: 'DELETE',
        headers: {
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!response.ok) throw new Error('Failed to delete tab');

      setTabOptionsMap((prev) => ({
        ...prev,
        [wikiId]: Object.fromEntries(
          Object.entries(prev[wikiId]).filter(([key]) => Number(key) !== tabId)
        ),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  // Add article list functions
  const addArticleList = async (newArticleList) => {
    try {
      const response = await fetch('/api/article-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(newArticleList),
      });

      if (!response.ok) throw new Error('Failed to add article list');

      const addedArticleList = await response.json();
      setArticleLists((prev) => ({ 
        ...prev, 
        [addedArticleList[0].id]: {
          name: addedArticleList[0].name,
          description: addedArticleList[0].description || ''
        }
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateArticleList = async (id, updatedArticleList) => {
    try {
      const response = await fetch(`/api/article-lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(updatedArticleList),
      });

      if (!response.ok) throw new Error('Failed to update article list');

      const updated = await response.json();
      setArticleLists((prev) => ({
        ...prev,
        [id]: {
          name: updated.name,
          description: updated.description || ''
        }
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteArticleList = async (id) => {
    try {
      // First, update all articles that use this list to remove the reference
      const updateArticlesResponse = await fetch(`/api/articles/remove-list/${id}`, {
        method: 'PUT',
        headers: {
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!updateArticlesResponse.ok) {
        const errorData = await updateArticlesResponse.json();
        throw new Error(errorData.error || 'Failed to update articles');
      }

      // Now delete the article list
      const response = await fetch(`/api/article-lists/${id}`, {
        method: 'DELETE',
        headers: {
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete article list');
      }

      setArticleLists((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    wikiOptions, 
    tabOptionsMap, 
    mainCategories,
    articleLists, // Add this line
    loading, 
    error, 
    addWiki, 
    addTab, 
    deleteWiki, 
    deleteTab,
    addMainCategory,
    updateMainCategory,
    deleteMainCategory,
    updateWikiMainCategory,
    updateWiki,
    updateTab,
    addArticleList, // Add these lines
    updateArticleList,
    deleteArticleList
  };
};
