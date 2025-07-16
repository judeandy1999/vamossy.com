import React from 'react';

export default function DownloadModal({ downloadDoc, setDownloadDoc, downloadFile }) {
  if (!downloadDoc) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={() => setDownloadDoc(null)}
          aria-label="Close download"
        >
          &times;
        </button>
        <div className="mb-4 font-semibold text-lg break-all">Download Document</div>
        <span>Are you sure you want to download <span className="font-medium text-gray-900">{downloadDoc.name}</span>?</span>
        <div className="mt-6 flex gap-2 justify-end">
          <button onClick={() => setDownloadDoc(null)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">Cancel</button>
          <button onClick={async () => {
            if (!downloadDoc) return;
            await downloadFile(downloadDoc.path, downloadDoc.name);
            setDownloadDoc(null);
          }} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all">Download</button>
        </div>
      </div>
    </div>
  );
}
