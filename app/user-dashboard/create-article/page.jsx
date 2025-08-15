'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useOptions } from '@/hooks/useOptions';
import RichTextEditor from '@/components/shared/rich-text-editor';
import { Save } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import EditorSidebar from '@/components/shared/editor-sidebar';
import { createArticle, updateArticle, deleteArticle } from '@/utils/articles';
import CollapsibleTabs from '@/components/shared/collapsible-tabs';
import { useArticleTabs } from '@/hooks/useArticleTabs';
import { useToast } from '@/contexts/toast-context';

export default function Page() {
  const { status, session } = useAuthWithRedirect();
  const { articles, loading, error, loadMore, isReachingEnd, addNewArticle, updateArticleInSidebar, deleteArticleFromSidebar } = useAllArticles();
  const { wikiOptions, tabOptionsMap, loading: optionsLoading, error: optionsError } = useOptions();
  const { showToast } = useToast();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);
  const [wikiCategory, setWikiCategory] = useState(0);
  const [hasTabs, setHasTabs] = useState(false);

  const { initialTabContents, tabContents, setTabContents, loading: tabsLoading } = useArticleTabs(selectedArticle?.id);

  const isEditing = !!selectedArticle;

  useEffect(() => {
    if (selectedArticle) {
      const { title, content, wiki_id, has_tabs } = selectedArticle;
      setTitle(title);
      setWikiCategory(wiki_id || 0);

      if (has_tabs) {
        setHasTabs(true);
        setContent('');
        setInitialContent('');
      } else {
        setHasTabs(false);
        setContent(content);
        setInitialContent(content);
      }
    } else {
      refreshContent();
    }
  }, [selectedArticle?.id]);

  const refreshContent = () => {
    setTitle('');
    setContent('');
    setWikiCategory(0);
    setHasTabs(false);
    setInitialContent('');
  };

  // Helper function to check individual tab sizes
  const validateTabSizes = (tabs) => {
    const maxSize = 900 * 1024; // 900KB limit
    const oversizedTabs = [];

    for (const [tabId, tabContent] of Object.entries(tabs)) {
      if (tabContent && tabContent.trim()) {
        try {
          const contentSize = new Blob([tabContent]).size;
          if (contentSize > maxSize) {
            oversizedTabs.push({
              tabId,
              size: contentSize,
              sizeInKB: (contentSize / 1024).toFixed(1)
            });
          }
        } catch (error) {
          console.error(`Error calculating size for tab ${tabId}:`, error);
          // If we can't calculate size, assume it's fine to avoid blocking saves
        }
      }
    }

    return oversizedTabs;
  };

  const saveArticle = async () => {
    // Validation checks
    if (!title.trim()) {
      showToast('Title cannot be empty!', 'error');
      return;
    }

    if (wikiCategory === 0) {
      showToast('Please select a category!', 'error');
      return;
    }

    if (!hasTabs && !content.trim()) {
      showToast('Content cannot be empty!', 'error');
      return;
    }

    if (hasTabs && Object.keys(tabContents).length === 0) {
      showToast('Please add content to at least one tab!', 'error');
      return;
    }

    // Size validation
    if (hasTabs && Object.keys(tabContents).length > 0) {
      const oversizedTabs = validateTabSizes(tabContents);
      if (oversizedTabs.length > 0) {
        const tabNames = oversizedTabs.map(tab => {
          const tabOption = tabOptionsMap[wikiCategory]?.[tab.tabId];
          const tabName = tabOption || `Tab ${tab.tabId}`;
          return `${tabName} (${tab.sizeInKB}KB)`;
        }).join(', ');
        
        showToast(
          `Cannot save article. The following tabs exceed the 900KB limit: ${tabNames}. Please reduce content size or remove large images before saving.`,
          'error'
        );
        return;
      }
    }

    if (!hasTabs) {
      const contentSize = new Blob([content]).size;
      const maxSize = 900 * 1024;
      
      if (contentSize > maxSize) {
        const sizeInKB = (contentSize / 1024).toFixed(1);
        showToast(
          `Cannot save article. Content is too large (${sizeInKB}KB). Maximum allowed is 900KB. Please reduce content size or remove large images.`,
          'error'
        );
        return;
      }
    }

    setIsSaving(true);

    try {
      const sanitizedContent = DOMPurify.sanitize(content);

      if (isEditing) {
        showToast('Updating article...', 'info', true);
        
        const updatedArticle = await updateArticle({
          id: selectedArticle.id,
          title,
          content: sanitizedContent,
          wiki_id: wikiCategory,
          has_tabs: hasTabs,
          user_email: session.user.email,
        });

        if (hasTabs && Object.keys(tabContents).length > 0) {
          showToast('Updating tabs...', 'info', true);
          await updateTabsIndividually(selectedArticle.id, tabContents);
        }

        showToast('Article updated successfully!', 'success');
        updateArticleInSidebar({
          ...updatedArticle,
          updated_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
      } else {
        showToast('Creating article...', 'info', true);
        
        const newArticle = await createArticle({
          title,
          content: sanitizedContent,
          wiki_id: wikiCategory,
          has_tabs: hasTabs,
          user_email: session.user.email,
        });

        // Wait for article creation before saving tabs
        if (hasTabs && Object.keys(tabContents).length > 0) {
          showToast('Saving tabs...', 'info', true);
          await saveTabsIndividually(newArticle.id, tabContents);
        }
        
        setNewlyCreatedId(newArticle.id);
        showToast('Article created successfully!', 'success');
        addNewArticle({
          ...newArticle,
          created_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
      }
      
      refreshContent();
      setContentChanged(!contentChanged);
    } catch (error) {
      console.error('Error saving article:', error);
      const errorMessage = error.message || 'Failed to save article!';
      showToast(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveTabsIndividually = async (articleId, tabs) => {
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    const accessToken = session.access_token;
    const tabEntries = Object.entries(tabs).filter(([, content]) => content && content.trim());

    if (tabEntries.length === 0) {
      return; // No tabs to save
    }

    for (const [tabId, tabContent] of tabEntries) {
      try {
        const res = await fetch('/api/tab-articles/create-tab', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
          body: JSON.stringify({
            article_id: articleId,
            tab_id: Number(tabId),
            content: tabContent
          })
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to save tab ${tabId}: ${errorText}`);
        }
      } catch (error) {
        console.error(`Error saving tab ${tabId}:`, error);
        throw error; // Re-throw to be caught by main try-catch
      }
    }
  };

  const updateTabsIndividually = async (articleId, tabs) => {
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    const accessToken = session.access_token;

    try {
      // Delete all existing tabs first
      const deleteRes = await fetch(`/api/tab-articles/${articleId}/delete-all`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!deleteRes.ok) {
        throw new Error('Failed to delete existing tabs');
      }

      // Then save new tabs
      await saveTabsIndividually(articleId, tabs);
    } catch (error) {
      console.error('Error updating tabs:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      deleteArticleFromSidebar(id);
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
        refreshContent();
      }
      showToast('Article deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete article:', error.message);
      showToast('Failed to delete article!', 'error');
    }
  };

  useEffect(() => {
    if (newlyCreatedId) {
      const timer = setTimeout(() => setNewlyCreatedId(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [newlyCreatedId]);

  const startNewArticle = () => {
    setSelectedArticle(null);
    refreshContent();
    setContentChanged(!contentChanged);
  };

  const handleTabContentChange = (tabId, newContent) => {
    setTabContents((prev) => ({
      ...prev,
      [tabId]: newContent,
    }));

    // Debounced size validation to avoid too many warnings
    if (newContent && newContent.trim()) {
      try {
        const contentSize = new Blob([newContent]).size;
        const maxSize = 900 * 1024;
        
        if (contentSize > maxSize) {
          const sizeInKB = (contentSize / 1024).toFixed(1);
          const tabName = tabOptionsMap[wikiCategory]?.[tabId]?.name || `Tab ${tabId}`;
          
          // Only show warning if content is significantly over limit
          if (contentSize > maxSize * 1.1) { // 10% buffer
            showToast(
              `Warning: ${tabName} content is ${sizeInKB}KB (exceeds 900KB limit). Article cannot be saved until this is reduced.`,
              'warning'
            );
          }
        }
      } catch (error) {
        console.error('Error calculating content size:', error);
      }
    }
  };

  // Improved useArticleTabs.js
  const fetchTabContents = async () => {
    if (!articleId) {
      setTabContents({});
      setInitialTabContents({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Always get fresh session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/tab-articles?id=${articleId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh session
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
        if (refreshedSession?.access_token) {
          // Retry with new token
          const retryResponse = await fetch(`/api/tab-articles?id=${articleId}`, {
            headers: {
              Authorization: `Bearer ${refreshedSession.access_token}`,
              'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
            },
          });
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          const tabs = await retryResponse.json();
          setTabContents(tabs);
          setInitialTabContents(tabs);
          return;
        }
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const tabs = await response.json();
      setTabContents(tabs);
      setInitialTabContents(tabs);
    } catch (error) {
      console.error('Error fetching tab contents:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || optionsLoading) {
    return <Spinner />;
  }

  if (optionsError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load options: {optionsError}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <EditorSidebar
        articles={articles}
        loading={loading}
        isReachingEnd={isReachingEnd}
        loadMore={loadMore}
        startNewArticle={startNewArticle}
        setSelectedArticle={setSelectedArticle}
        selectedArticleId={selectedArticle?.id}
        handleDelete={handleDelete}
        error={error}
        newlyCreatedId={newlyCreatedId}
      />

      {/* Content Editor */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">{isEditing ? 'Edit Article' : 'New Article'}</h1>
            <button
              onClick={saveArticle}
              disabled={isSaving || !title.trim() || wikiCategory === 0}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded text-white transition ${
                isSaving || !title.trim() || wikiCategory === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-slate-500 hover:bg-slate-700'
              }`}
            >
              <Save size={16} /> {isEditing ? 'Save' : 'Create'}
            </button>
          </div>

          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-slate-400"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="wiki" className="block mb-1 text-sm text-slate-600 font-medium">Category</label>
          <select
            id="wiki"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-slate-400"
            value={wikiCategory}
            onChange={(e) => setWikiCategory(Number(e.target.value))}
          >
            <option value={0}>Select a category</option>
            {Object.entries(wikiOptions).map(([key, wikiData]) => (
              <option key={key} value={key}>{wikiData.name}</option>
            ))}
          </select>

          {wikiCategory !== 0 && (
            <div className="mb-4">
              <label className="flex items-center gap-2 text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={hasTabs}
                  onChange={(e) => setHasTabs(e.target.checked)}
                  className="accent-slate-600"
                />
                This article has tabs
              </label>
            </div>
          )}

          {hasTabs && (
            <CollapsibleTabs
              currentTabOptions={wikiCategory ? tabOptionsMap[wikiCategory] || {} : {}}
              tabContents={tabContents}
              initialTabContents={initialTabContents}
              handleTabContentChange={handleTabContentChange}
              contentChanged={contentChanged}
              selectedArticle={selectedArticle}
            />
          )}

          {!hasTabs && (
            <RichTextEditor
              contentChanged={contentChanged}
              selectedArticle={selectedArticle?.id}
              key={selectedArticle?.id || 'new'}
              content={content}
              initialContent={initialContent}
              onContentChange={setContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
