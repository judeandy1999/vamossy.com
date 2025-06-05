'use client';

import { useSession, signIn } from 'next-auth/react';
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

export default function Page() {
  const { data: session, status } = useSession();
  const { articles, loading, error, loadMore, isReachingEnd, addNewArticle, updateArticleInSidebar, deleteArticleFromSidebar } = useAllArticles();
  const { wikiOptions, tabOptionsMap, loading: optionsLoading, error: optionsError } = useOptions();

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [savingStatus, setSavingStatus] = useState(null);
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

  const saveArticle = async () => {
    if (!title.trim() || (!content.trim() && !hasTabs)) {
      setSavingStatus('Title and content cannot be empty!');
      return;
    }

    setIsSaving(true);

    try {
      const sanitizedContent = DOMPurify.sanitize(content);

      if (isEditing) {
        const updatedArticle = await updateArticle({
          id: selectedArticle.id,
          title,
          content: sanitizedContent,
          wiki_id: wikiCategory,
          has_tabs: hasTabs,
          tabs: hasTabs ? tabContents : null,
        });
        setSavingStatus('Article updated!');
        updateArticleInSidebar({
          ...updatedArticle,
          updated_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
      } else {
        const newArticle = await createArticle({
          title,
          content: sanitizedContent,
          wiki_id: wikiCategory,
          has_tabs: hasTabs,
          tabs: hasTabs ? tabContents : null,
        });
        setNewlyCreatedId(newArticle.id);
        setSavingStatus('Article created!');
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
      setSavingStatus('Failed to save article!');
    } finally {
      setIsSaving(false);
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
    } catch (error) {
      console.error('Failed to delete article:', error.message);
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
  };

  if (status === 'loading' || optionsLoading) {
    return <Spinner />;
  }

  if (!session) {
    signIn();
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
    <div className="pt-16 flex h-screen bg-gray-50">
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

          {savingStatus && (
            <p className="mt-2 text-sm text-slate-500">{savingStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
