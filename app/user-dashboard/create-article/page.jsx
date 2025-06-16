'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useOptions } from '@/hooks/useOptions';
import RichTextEditor from '@/components/rich-text-editor';
import { Save } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Sidebar from '@/components/editor-sidebar';
import { createArticle, updateArticle, deleteArticle } from '@/utils/articles';
import CollapsibleTabs from '@/components/collapsible-tabs';
import { useArticleTabs } from '@/hooks/useArticleTabs';
import { useToast } from '@/contexts/toastContext';
import { supabase } from '@/utils/client';

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
        const contentSize = new Blob([tabContent]).size;
        if (contentSize > maxSize) {
          oversizedTabs.push({
            tabId,
            size: contentSize,
            sizeInKB: (contentSize / 1024).toFixed(1)
          });
        }
      }
    }

    return oversizedTabs;
  };

  // Helper function to format size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const saveArticle = async () => {
    if (!title.trim() || (!content.trim() && !hasTabs)) {
      showToast('Title and content cannot be empty!', 'error');
      return;
    }

    // Validate tab sizes before saving - BLOCK ALL SAVING if any tab is too large
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
        return; // Stop execution - don't save anything
      }
    }

    // Validate regular content size for non-tab articles
    if (!hasTabs) {
      const contentSize = new Blob([content]).size;
      const maxSize = 900 * 1024;
      
      if (contentSize > maxSize) {
        const sizeInKB = (contentSize / 1024).toFixed(1);
        showToast(
          `Cannot save article. Content is too large (${sizeInKB}KB). Maximum allowed is 900KB. Please reduce content size or remove large images.`,
          'error'
        );
        return; // Stop execution - don't save anything
      }
    }

    setIsSaving(true);

    try {
      const sanitizedContent = DOMPurify.sanitize(content);

      if (isEditing) {
        // Step 1: Update article WITHOUT tabs data
        showToast('Updating article...', 'info');
        
        const updatedArticle = await updateArticle({
          id: selectedArticle.id,
          title,
          content: sanitizedContent,
          wiki_id: wikiCategory,
          has_tabs: hasTabs,
          user_email: session.user.email,
        });

        // Step 2: Handle tabs separately if they exist
        if (hasTabs && Object.keys(tabContents).length > 0) {
          showToast('Updating tabs...', 'info');
          await updateTabsIndividually(selectedArticle.id, tabContents);
        }

        showToast('Article updated successfully!', 'success');
        updateArticleInSidebar({
          ...updatedArticle,
          updated_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
      } else {
        // Step 1: Create article WITHOUT tabs data
        showToast('Creating article...', 'info');
        
        const newArticle = await createArticle({
          title,
          content: sanitizedContent,
          wiki_id: wikiCategory,
          has_tabs: hasTabs,
          user_email: session.user.email,
        });

        // Step 2: Save tabs separately if they exist
        if (hasTabs && Object.keys(tabContents).length > 0) {
          showToast('Saving tabs...', 'info');
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
      console.error('Error saving article:', error.message);
      showToast(error.message || 'Failed to save article!', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Add this helper function for updating tabs
  const updateTabsIndividually = async (articleId, tabs) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    // First, delete existing tabs for this article
    await fetch(`/api/tab-articles/${articleId}/delete-all`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
      },
    });

    // Then create new tabs
    for (const [tabId, tabContent] of Object.entries(tabs)) {
      if (tabContent && tabContent.trim()) {
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
          throw new Error(`Failed to update tab ${tabId}: ${errorText}`);
        }
      }
    }
  };

  // Keep the existing saveTabsIndividually function for new articles
  const saveTabsIndividually = async (articleId, tabs) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    for (const [tabId, tabContent] of Object.entries(tabs)) {
      if (tabContent && tabContent.trim()) {
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
      }
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

    // Check size and show warning if too large
    const contentSize = new Blob([newContent]).size;
    const maxSize = 900 * 1024; // 900KB
    
    if (contentSize > maxSize) {
      const sizeInKB = (contentSize / 1024).toFixed(1);
      const tabName = tabOptionsMap[wikiCategory]?.[tabId] || `Tab ${tabId}`;
      showToast(
        `Warning: ${tabName} content is ${sizeInKB}KB (exceeds 900KB limit). Article cannot be saved until this is reduced.`,
        'warning'
      );
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
      <Sidebar
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

          <label htmlFor="wiki" className="block mb-1 text-sm text-slate-600 font-medium">Wiki Category</label>
          <select
            id="wiki"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-slate-400"
            value={wikiCategory}
            onChange={(e) => setWikiCategory(Number(e.target.value))}
          >
            <option value={0}>Select a wiki category</option>
            {Object.entries(wikiOptions).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
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
