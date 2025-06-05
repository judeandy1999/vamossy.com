'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Spinner from './ui/spinner';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), { ssr: false });

export default function RichTextEditor({ contentChanged, selectedArticle, content, initialContent, onContentChange }) {
  const editorRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !loaded) {
      const script = document.createElement('script');
      script.src = '/tinymce/tinymce.min.js';
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    }
  }, [loaded]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setContent(content || '');
    }
  }, [contentChanged, selectedArticle]);

  if (!loaded) return <Spinner />;

  return (
    <Editor
      init={{
        height: 470,
        menubar: true,
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | formatselect | bold italic underline strikethrough | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image media table | ' +
          'removeformat',
        content_style: `
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
          table, th, td { border: 1px solid #ddd; border-collapse: collapse; }
          th, td { padding: 8px; }
        `,
        paste_retain_style_properties: "all",
        paste_webkit_styles: "all",
        paste_merge_formats: true,
      }}
      initialValue={initialContent || ''}
      onEditorChange={(newContent) => onContentChange(newContent)}
      onInit={(evt, editor) => (editorRef.current = editor)}
    />
  );
}
