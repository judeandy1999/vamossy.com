import React from 'react';

export default function PreviewModal({ previewFile, previewText, setPreviewFile }) {
  if (!previewFile) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={() => {
            if (previewFile && previewFile.url) URL.revokeObjectURL(previewFile.url);
            setPreviewFile(null);
          }}
          aria-label="Close preview"
        >
          &times;
        </button>
        <div className="mb-4 font-semibold text-lg break-all">{previewFile.file.name}</div>
        {previewFile.file.type.startsWith('image/') ? (
          <img src={previewFile.url} alt={previewFile.file.name} className="max-h-96 max-w-full mx-auto rounded border" />
        ) : previewFile.file.type.startsWith('text/') ? (
          <pre className="bg-gray-100 rounded p-2 max-h-96 overflow-auto text-xs whitespace-pre-wrap break-all">
            {previewText || 'Loading preview...'}
          </pre>
        ) : previewFile.file.type === 'application/pdf' ? (
          <iframe src={previewFile.url} width="100%" height="500" title="PDF Preview" className="border-0 w-full bg-gray-50 rounded" />
        ) : (
          <div className="text-gray-500 text-sm">
            No preview available. <a href={previewFile.url} download={previewFile.file.name} className="text-blue-600 underline">Download</a>
          </div>
        )}
      </div>
    </div>
  );
}
