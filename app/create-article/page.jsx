// app/articles/create/page.jsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/utils/client';

export default function CreateArticlePage() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '<h2>New Article</h2><p>Start writing...</p>',
  });

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(null);

  const saveArticle = async () => {
    const rawHtml = editor.getHTML();
    const html = DOMPurify.sanitize(rawHtml);

    // Extract a plain-text preview from the HTML (first 150 chars)
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const preview = tempElement.innerText.slice(0, 150);

    const { error } = await supabase.from('articles').insert({
      content: html,
      preview,
      title: title || 'Untitled Article'
    });

    if (error) setStatus('Error saving article');
    else setStatus('Article saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-32">
      <h1 className="text-3xl font-bold mb-4">Create New Article</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter article title"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />
      <div className="border p-4 rounded bg-white">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
        onClick={saveArticle}
      >
        Save Article
      </button>
      {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
    </div>
  );
}