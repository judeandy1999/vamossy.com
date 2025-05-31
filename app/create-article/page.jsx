// app/create-article/page.jsx
'use client';

import { useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/utils/client';
import RichTextEditor from '@/components/rich-text-editor';

export default function Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(null);

  const saveArticle = async () => {
    if (!content.trim()) {
      setStatus('Content cannot be empty!');
      return;
    }

    const html = DOMPurify.sanitize(content);
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const preview = tempElement.innerText.slice(0, 150);

    const { error } = await supabase.from('articles').insert([
      { title: title || 'Untitled Article', preview, content: html },
    ]);

    if (error) {
      console.error('Error saving article:', error.message);
      setStatus('❌ Error saving article');
    } else {
      setStatus('✅ Article saved successfully!');
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pt-32">
      <h1 className="text-2xl font-bold mb-4">Create New Article</h1>

      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <RichTextEditor content={content} onContentChange={setContent} />

      <button
        onClick={saveArticle}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Save Article
      </button>

      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
