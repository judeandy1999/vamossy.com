import React from 'react';
import CustomModal from '@/components/ui/CustomModal';

export function PreviewModal({ previewDoc, closePreview }) {
  return (
    <CustomModal
      isOpen={!!previewDoc}
      onClose={closePreview}
      title={previewDoc?.name || 'Preview'}
      actions={null}
    >
      {previewDoc && (
        previewDoc.type === 'application/pdf' ? (
          <iframe src={previewDoc.url} width="100%" height="500" title="PDF Preview" className="border-0 w-full bg-gray-50 rounded" />
        ) : previewDoc.type && previewDoc.type.startsWith('image/') ? (
          <img src={previewDoc.url} alt={previewDoc.name} className="max-h-96 max-w-full mx-auto rounded border" />
        ) : previewDoc.type && previewDoc.type.startsWith('text/') ? (
          <pre className="bg-gray-100 rounded p-2 max-h-96 overflow-auto text-xs whitespace-pre-wrap break-all">Preview not available.</pre>
        ) : (
          <div className="text-gray-500 text-sm">No preview available.</div>
        )
      )}
    </CustomModal>
  );
}

export function DownloadModal({ show, onCancel, onDownload, downloadName }) {
  return (
    <CustomModal
      isOpen={show}
      onClose={onCancel}
      title="Download Document"
      actions={[
        <button key="cancel" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">Cancel</button>,
        <button key="download" onClick={onDownload} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all">Download</button>
      ]}
    >
      <span>Are you sure you want to download <span className="font-medium text-gray-900">{downloadName}</span>?</span>
    </CustomModal>
  );
}
