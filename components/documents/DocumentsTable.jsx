import React from 'react';
import { AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';

export default function DocumentsTable({ documents, loading, handlePreview, handleDownload }) {
  return (
    <div className="bg-white/95 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</th>
            <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Download</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-gray-400 text-lg font-medium animate-pulse">Loading...</td>
            </tr>
          ) : documents.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-gray-300 text-lg font-medium">No documents found.</td>
            </tr>
          ) : (
            documents.map(doc => (
              <tr key={doc.id} className="hover:bg-yellow-50/60 transition-colors group">
                <td className="px-5 py-3 font-medium text-gray-800 group-hover:text-yellow-700 truncate max-w-xs">{doc.name}</td>
                <td className="px-5 py-3 text-gray-600">{(doc.size / 1024).toFixed(1)} KB</td>
                <td className="px-5 py-3 text-gray-600">{doc.type}</td>
                <td className="px-5 py-3 text-gray-500">{new Date(doc.created_at).toLocaleString()}</td>
                <td className="px-5 py-3 text-center align-middle">
                  {doc.type === 'application/pdf' ? (
                    <button
                      onClick={() => handlePreview(doc.url, doc.name, doc.type)}
                      className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm inline-flex items-center gap-2"
                      style={{ minWidth: 90 }}
                    >
                      <AiOutlineEye />
                      Preview
                    </button>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-5 py-3 text-center align-middle">
                  <button
                    onClick={() => handleDownload(doc.url, doc.name)}
                    className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-300 text-sm inline-flex items-center gap-2"
                    style={{ minWidth: 90 }}
                  >
                    <AiOutlineDownload />
                    Download
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
