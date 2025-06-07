import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';

export const useArticleTabs = (articleId) => {
  const [tabContents, setTabContents] = useState({});
  const [initialTabContents, setInitialTabContents] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTabContents = async () => {
      if (!articleId) {
        setTabContents({});
        setInitialTabContents({});
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        const response = await fetch(`/api/tab-articles?id=${articleId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tab contents');
        }

        const tabs = await response.json();
        const formattedTabs = tabs.reduce((acc, tab) => {
          acc[tab.tab_id] = tab.content;
          return acc;
        }, {});

        setTabContents(formattedTabs);
        setInitialTabContents(formattedTabs);
      } catch (error) {
        console.error('Error fetching tab contents:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTabContents();
  }, [articleId]);

  return { initialTabContents, tabContents, setTabContents, loading, error };
};
