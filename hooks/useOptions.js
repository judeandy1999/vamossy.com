import { useState, useEffect } from 'react';

export const useOptions = () => {
  const [wikiOptions, setWikiOptions] = useState({});
  const [tabOptionsMap, setTabOptionsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);

        // Fetch wiki options
        const wikiResponse = await fetch('/api/wiki-options');
        const wikiData = await wikiResponse.json();
        if (!wikiResponse.ok) throw new Error(wikiData.error || 'Failed to fetch wiki options');

        // Fetch tab options
        const tabResponse = await fetch('/api/tab-options');
        const tabJson = await tabResponse.json();
        if (!tabResponse.ok) throw new Error(tabData.error || 'Failed to fetch tab options');
        const tabData = tabJson.data || []; 

        // Format wiki options
        const formattedWikiOptions = wikiData.reduce((acc, wiki) => {
          acc[wiki.id] = wiki.name;
          return acc;
        }, {});

        // Format tab options
        const formattedTabOptionsMap = tabData.reduce((acc, tab) => {
          if (!acc[tab.wiki_id]) acc[tab.wiki_id] = {};
          acc[tab.wiki_id][tab.id] = tab.name;
          return acc;
        }, {});

        setWikiOptions(formattedWikiOptions);
        setTabOptionsMap(formattedTabOptionsMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const addWiki = async (newWiki) => {
    try {
      const response = await fetch('/api/wiki-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWiki),
      });
      if (!response.ok) throw new Error('Failed to add wiki');
      const addedWiki = await response.json();
      setWikiOptions((prev) => ({ ...prev, [addedWiki[0].id]: addedWiki[0].name }));
    } catch (err) {
      setError(err.message);
    }
  };

  const addTab = async (newTab) => {
    try {
      const response = await fetch('/api/tab-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTab),
      });
      if (!response.ok) throw new Error('Failed to add tab');
      const addedTabJson = await response.json();
      const addedTab = addedTabJson.data || [];
      setTabOptionsMap((prev) => ({
        ...prev,
        [newTab.wiki_id]: {
          ...prev[newTab.wiki_id],
          [addedTab[0].id]: addedTab[0].name,
        },
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteWiki = async (wikiId) => {
    try {
      const response = await fetch(`/api/wiki-options/${wikiId}`, {
        method: 'DELETE',
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

  return { wikiOptions, tabOptionsMap, loading, error, addWiki, addTab, deleteWiki, deleteTab };
};