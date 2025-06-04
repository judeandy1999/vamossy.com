'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useOptions } from '@/hooks/useOptions'; // Import the custom hook
import RichTextEditor from '@/components/rich-text-editor';
import { Save } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Sidebar from '@/components/editor-sidebar';
import { createArticle, updateArticle, deleteArticle } from '@/utils/articles';
import CollapsibleTabs from '@/components/collapsible-tabs';

export default function Page() {
  const { data: session, status } = useSession();
  const { articles, loading, error, loadMore, isReachingEnd, addNewArticle, updateArticleInSidebar, deleteArticleFromSidebar } = useAllArticles();
  const { wikiOptions, tabOptionsMap, loading: optionsLoading, error: optionsError } = useOptions(); // Use the hook

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [savingStatus, setSavingStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);
  const [wikiCategory, setWikiCategory] = useState(0);
  const [tabOption, setTabOption] = useState(0);
  const [hasTabs, setHasTabs] = useState(false);
  const [tabContents, setTabContents] = useState({});

  const currentTabOptions = wikiCategory ? tabOptionsMap[wikiCategory] || {} : {};
console.log('Current Tab Options:', currentTabOptions);
  const isEditing = !!selectedArticle;

  useEffect(() => {
    if (selectedArticle) {
      const { title, content, wiki, tab } = selectedArticle;
      setTitle(title);
      setContent(content);
      setWikiCategory(wiki || 0);
      setTabOption(tab || 0);
    } else {
      refreshContent();
    }
  }, [selectedArticle?.id]);

  const refreshContent = () => {
    setTitle('');
    setContent('');
    setWikiCategory(0);
    setTabOption(0);
  };

  const saveArticle = async () => {
    if (!title.trim() || !content.trim()) {
      setSavingStatus('Title and content cannot be empty!');
      return;
    }

    setIsSaving(true);

    const html = DOMPurify.sanitize(content);
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const preview = tempElement.innerText.slice(0, 150);

    try {
      if (isEditing) {
        const updatedArticle = await updateArticle({
          id: selectedArticle.id,
          title,
          preview,
          content: html,
          wiki: wikiCategory,
          tab: tabOption,
        });
        setSavingStatus('Article updated!');
        updateArticleInSidebar({
          ...updatedArticle,
          updated_at: new Date().toISOString(),
        });
        refreshContent();
      } else {
        const newArticle = await createArticle({
          title: title || 'Untitled',
          preview,
          content: html,
          user_email: session.user.email,
          wiki: wikiCategory,
          tab: tabOption,
        });
        setNewlyCreatedId(newArticle.id);
        setSavingStatus('Article created!');
        addNewArticle({
          ...newArticle,
          created_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
        refreshContent();
      }
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

  const handleTabContentChange = (tabKey, content) => {
    setTabContents((prev) => ({
      ...prev,
      [tabKey]: content,
    }));
  };

  if (status === 'loading' || optionsLoading) return <Spinner />;
  if (!session) {
    signIn();
    return <Spinner />;
  }

  if (optionsError) {
    return <p className="text-red-500">Failed to load options: {optionsError}</p>;
  }

  return (
    <div className="pt-16 flex h-screen">
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
      <div className="bg-white flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Article' : 'New Article'}</h1>
          <button
            onClick={saveArticle}
            disabled={isSaving || !title.trim() || !content.trim() || wikiCategory === 0 || tabOption === 0}
            className={`disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 ${
              isSaving ? 'cursor-wait' : ''
            }`}
          >
            <Save size={16} /> {isEditing ? 'Save Changes' : 'Create Article'}
          </button>
        </div>

        <input
          type="text"
          className="border border-gray-300 w-3/4 p-2 mb-4 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Wiki Dropdown */}
        <label htmlFor="wiki" className="block mb-1 text-gray-700 font-medium">Wiki</label>
        <select
          id="wiki"
          className="border border-gray-300 w-1/2 p-2 mb-4 rounded"
          value={wikiCategory}
          onChange={(e) => {
            setWikiCategory(Number(e.target.value));
            setTabOption(0); // Reset tab if wiki changes
          }}
        >
          <option value={0}>Select a wiki category</option>
          {Object.entries(wikiOptions).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {/* Checkbox for Tabs */}
        {wikiCategory !== 0 && (
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasTabs}
                onChange={(e) => setHasTabs(e.target.checked)}
              />
              <span className="text-gray-700 font-medium">Does this article have tabs?</span>
            </label>
          </div>
        )}

        {/* Render Text Editors for Tabs */}
        {hasTabs && (
          <CollapsibleTabs
            currentTabOptions={currentTabOptions}
            tabContents={tabContents}
            handleTabContentChange={handleTabContentChange}
            contentChanged={contentChanged}
            selectedArticle={selectedArticle}
          />
        )}

        {/* Main Content Editor */}
        {!hasTabs && (
          <RichTextEditor
            contentChanged={contentChanged}
            selectedArticle={selectedArticle?.id}
            key={selectedArticle?.id || 'new'}
            content={content}
            onContentChange={setContent}
          />
        )}

        {savingStatus && <p className="mt-2 text-sm text-gray-600">{savingStatus}</p>}
      </div>
    </div>
  );
}
