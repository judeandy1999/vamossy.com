// app/create-article/page.jsx
'use client';

import { useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/utils/client';
import RichTextEditor from '@/components/rich-text-editor';
import { Save } from 'lucide-react';

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
    <div className="mx-24 p-4 pt-32">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[48px] font-light">Create New Article</h1>
        <button
          onClick={saveArticle}
          className="flex items-center gap-2 bg-[#02355A] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-600 transition-colors"
        >
          <Save size={20} />
          <span>SAVE CHANGES</span>
        </button>
      </div>
  
      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-1/2 mb-4 p-3 border-gray-400 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
  
      <RichTextEditor content={content} onContentChange={setContent} />
  
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
