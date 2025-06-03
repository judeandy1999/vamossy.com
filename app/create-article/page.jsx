'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useAllArticles } from '@/hooks/useAllArticles';
import RichTextEditor from '@/components/rich-text-editor';
import { Save } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { FilePlus, Trash } from 'lucide-react';
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

  const isEditing = !!selectedArticle;

  console.log('Selected Article:', selectedArticle);
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
        setTitle('');
        setContent('');
        setNewlyCreatedId(newArticle.id);
        setSavingStatus('Article created!');
        addNewArticle({
          ...newArticle,
          created_at: new Date().toISOString(),
        });
      }
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
  };

  if (status === 'loading') return <Spinner />;
  if (!session) {
    signIn();
    return <Spinner />;
  }

  return (
    <div className="pt-16 flex h-screen">
      <div className="w-64 bg-gray-100 p-4 overflow-y-auto border-r">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Articles</h2>
          <button
            onClick={startNewArticle}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 w-auto"
          >
            <FilePlus size={16} /> New Article
          </button>
        </div>
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="text-red-500">Failed to load articles</p>
        ) : (
          <ul className="space-y-2">
            {articles.map((article) => (
              <li
                key={article.id}
                className={`flex justify-between cursor-pointer p-2 rounded hover:bg-gray-200 transition-all duration-300 ${
                  selectedArticle?.id === article.id ? 'bg-gray-300' : ''
                } ${String(article.id) === String(newlyCreatedId) ? 'animate-popIn' : ''}`}
                onClick={() => setSelectedArticle(article)}
              >
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-xs text-gray-600">
                    {new Date(article.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(article.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
            {!isReachingEnd && (
              <button
                onClick={loadMore}
                className="mt-4 text-gray-600 hover:text-blue-400 text-sm rounded px-2 py-1"
              >
                Load More...
              </button>
            )}
          </ul>
        )}
      </div>

      <div className="bg-white flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Article' : 'New Article'}</h1>
          <button
            onClick={saveArticle}
            disabled={isSaving}
            className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 ${
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

        <RichTextEditor selectedArticle={selectedArticle?.id} key={selectedArticle?.id || 'new'} content={content} onContentChange={setContent} />

        {savingStatus && <p className="mt-2 text-sm text-gray-600">{savingStatus}</p>}
      </div>
    </div>
  );
}
