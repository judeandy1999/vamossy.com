'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useAllArticles } from '@/hooks/useAllArticles';
import RichTextEditor from '@/components/rich-text-editor';
import { Save } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Sidebar from '@/components/editor-sidebar';
import { createArticle, updateArticle, deleteArticle } from '@/utils/articles';

export default function Page() {
  const { data: session, status } = useSession();
  const { articles, loading, error, loadMore, isReachingEnd, addNewArticle, updateArticleInSidebar, deleteArticleFromSidebar } = useAllArticles();

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [savingStatus, setSavingStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);

  const isEditing = !!selectedArticle;
  
  useEffect(() => {
    if (selectedArticle) {
      setTitle(selectedArticle.title);
      setContent(selectedArticle.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [selectedArticle?.id]);

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
        });
        setSavingStatus('Article updated!');
        updateArticleInSidebar({
          ...updatedArticle,
          updated_at: new Date().toISOString(),
        });
        setTitle('');
        setContent('');
      } else {
        const newArticle = await createArticle({
          title: title || 'Untitled',
          preview,
          content: html,
          user_email: session.user.email,
        });
        setNewlyCreatedId(newArticle.id);
        setSavingStatus('Article created!');
        addNewArticle({
          ...newArticle,
          created_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
        setTitle('');
        setContent('');
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
        setTitle('');
        setContent('');
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
    setTitle('');
    setContent('');
    setContentChanged(!contentChanged);
  };

  if (status === 'loading') return <Spinner />;
  if (!session) {
    signIn();
    return <Spinner />;
  }

  return (
    <div className="pt-16 flex h-screen">
      {/* sidebar */}
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

      {/* Content Editor*/}
      <div className="bg-white flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Article' : 'New Article'}</h1>
          <button
            onClick={saveArticle}
            disabled={isSaving || !title.trim() || !content.trim()}
            className={`disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 ${
              isSaving ? 'cursor-wait' : ''
            }`}
          >
            <Save size={16} /> {isEditing ? 'Save Changes' : 'Create Article'}
          </button>
        </div>

        <input
          type="text"
          className="border w-full p-2 mb-4 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <RichTextEditor contentChanged={contentChanged} selectedArticle={selectedArticle?.id} key={selectedArticle?.id || 'new'} content={content} onContentChange={setContent} />

        {savingStatus && <p className="mt-2 text-sm text-gray-600">{savingStatus}</p>}
      </div>
    </div>
  );
}
