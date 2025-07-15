"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/client';
import DocumentsTable from './DocumentsTable';
import DocumentsFilterBar from './DocumentsFilterBar';
import { PreviewModal, DownloadModal } from './DocumentsModals';

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
  const [previewDoc, setPreviewDoc] = useState(null); 

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments(filters = {}) {
    setLoading(true);
    const { documents } = await fetchDocuments(filters);
    let docs = documents || [];
    
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
      <DocumentsFilterBar
        search={search}
        sortOrder={sortOrder}
        handleSearch={handleSearch}
        handleSortChange={handleSortChange}
      />
      <DocumentsTable
        documents={documents}
        loading={loading}
        handlePreview={handlePreview}
        handleDownload={handleDownload}
      />
      <PreviewModal previewDoc={previewDoc} closePreview={closePreview} />
      <DownloadModal show={showDownloadConfirm} onCancel={cancelDownload} onDownload={confirmDownload} downloadName={downloadName} />
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
