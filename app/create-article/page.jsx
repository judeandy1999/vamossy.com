'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/utils/client';
import { Bold, Italic, Link as LinkIcon, Type, X } from 'lucide-react';

// Toolbar Button Component
const ToolbarButton = ({ onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center p-2 rounded hover:bg-gray-200 focus:bg-gray-300 transition-colors"
    aria-label={label}
    title={label}
  >
    <Icon size={18} />
  </button>
);

// Modern Toolbar
const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 border rounded bg-white shadow mb-4 sticky top-0 z-10">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={Bold}
        label="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={Italic}
        label="Italic"
      />
      <ToolbarButton
        onClick={setLink}
        icon={LinkIcon}
        label="Add Link"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        icon={X}
        label="Remove Link"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setMark('textStyle', { fontSize: '24px' }).run()}
        icon={Type}
        label="Big Text"
      />
    </div>
  );
};

export default function CreateArticlePage() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({ openOnClick: false }),
      TextStyle.extend({
        addAttributes() {
          return {
            fontSize: {
              default: null,
              parseHTML: element => element.style.fontSize || null,
              renderHTML: attributes => {
                if (!attributes.fontSize) return {};
                return { style: `font-size: ${attributes.fontSize}` };
              },
            },
          };
        },
      }),
    ],
    content: '',
  });

  const saveArticle = async () => {
    if (!editor) return;

    const rawHtml = editor.getHTML();
    const html = DOMPurify.sanitize(rawHtml);

    // Extract a plain-text preview from the HTML (first 150 chars)
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const preview = tempElement.innerText.slice(0, 150);

    const { error } = await supabase.from('articles').insert([
      { title: title || 'untitled article', preview, content: html },
    ]);

    if (error) {
      console.error('Error saving article:', error.message);
      setStatus('Error saving article');
    } else {
      setStatus('Article saved successfully!');
      setTitle('');
      editor.commands.setContent('');
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

      <Toolbar editor={editor} />

      <EditorContent
        editor={editor}
        className="border p-4 rounded min-h-[300px] bg-white shadow focus:outline-none"
      />

      <button
        onClick={saveArticle}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Save Article
      </button>

      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}

      {/* Global styles for links */}
      <style jsx global>{`
        .ProseMirror a {
          color: #2563eb; /* Tailwind blue-600 */
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
