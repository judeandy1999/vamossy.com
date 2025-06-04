'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import EditorToolbar from './editor-toolbar';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

export default function RichTextEditor({ contentChanged, selectedArticle, content, onContentChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content || '');
    }
  }, [contentChanged, selectedArticle, editor]);

  return (
    <div className='relative'>
      <div className='absolute right-0 top-2 w-[99%] p-2 py-0'>
        <EditorToolbar editor={editor} />
      </div>
      <EditorContent
        editor={editor}
        className="relative border border-gray-400 h-[60vh] z-5 pt-13 p-4 min-h-[400px] rounded bg-white shadow focus:outline-none flex flex-col"
      />
    </div>
  );
};
