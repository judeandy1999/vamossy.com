"use client";

import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';
import { supabase } from '../../utils/client';
import CustomModal from '../ui/CustomModal';

// Helper: fetch documents with filters, including auth token
async function fetchDocuments(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const res = await fetch(`/api/documents?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
}

export default function UserDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null); // { url, name, type }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments(filters = {}) {
    setLoading(true);
    const { documents } = await fetchDocuments(filters);
    let docs = documents || [];
    // Apply sorting client-side (if not sorted by backend)
    if (sortOrder === 'newest') {
      docs = docs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOrder === 'oldest') {
      docs = docs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOrder === 'name-az') {
      docs = docs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-za') {
      docs = docs.sort((a, b) => b.name.localeCompare(a.name));
    }
    setDocuments(docs);
    setLoading(false);
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    loadDocuments({ search: e.target.value });
  }

  function handleSortChange(e) {
    setSortOrder(e.target.value);
    loadDocuments({ search });
  }

  function handleFilterChange() {
    loadDocuments({ search });
  }

  function handlePreview(url, name, type) {
    setPreviewDoc({ url, name, type });
  }

  function closePreview() {
    setPreviewDoc(null);
  }

  function handleDownload(url, name) {
    setDownloadUrl(url);
    setDownloadName(name);
    setShowDownloadConfirm(true);
  }

  async function confirmDownload() {
    if (!downloadUrl) return;
    await downloadFile(downloadUrl, downloadName);
    setShowDownloadConfirm(false);
    setDownloadUrl(null);
    setDownloadName('');
  }

  async function downloadFile(fileUrl, fileName) {
    try {
      let path = fileUrl;
      // If fileUrl is a public URL, extract the storage path after '/object/public/documents/'
      const match = fileUrl.match(/\/object\/public\/(documents\/[^?]+)/);
      if (match && match[1]) {
        path = match[1];
      }
      // Always ensure 'documents/' prefix for user documents
      if (!path.startsWith('documents/')) {
        path = 'documents/' + path;
      }
      const response = await fetch(`/api/documents/download-documents?path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'downloaded-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download file: ' + error.message);
    }
  }

  function cancelDownload() {
    setShowDownloadConfirm(false);
    setDownloadUrl(null);
    setDownloadName('');
  }

  return (
    <div className="user-documents-page p-4 md:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">My Documents</h2>
      {/* Enhanced Filter Bar */}
      <div className="bg-white/90 rounded-xl shadow-lg mb-10 border border-gray-100">
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-gray-700 transition-all duration-150"
            />
          </div>
          {/* Sort Filter */}
          <div className="w-full md:w-60 flex items-center">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-gray-700 font-medium appearance-none transition-all duration-150 cursor-pointer"
              style={{ minWidth: 160 }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-az">Filename A-Z</option>
              <option value="name-za">Filename Z-A</option>
            </select>
          </div>
        </div>
      </div>
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
                        <AiOutlineEye size={18} className="inline-block align-middle" />
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
                      <AiOutlineDownload size={18} className="inline-block align-middle" />
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
      <CustomModal
        isOpen={showDownloadConfirm}
        onClose={cancelDownload}
        title="Download Document"
        actions={[
          <button key="cancel" onClick={cancelDownload} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">Cancel</button>,
          <button key="download" onClick={confirmDownload} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all">Download</button>
        ]}
      >
        <span>Are you sure you want to download <span className="font-medium text-gray-900">{downloadName}</span>?</span>
      </CustomModal>
      <style jsx>{`
        @media (max-width: 640px) {
          .user-documents-page h2 {
            font-size: 1.5rem;
          }
          table th, table td {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            font-size: 0.95rem;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
