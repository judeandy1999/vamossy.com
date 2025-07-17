"use client";

import React, { useState, useEffect } from 'react';
import DocumentsTable from './DocumentsTable';
import DocumentsFilterBar from './DocumentsFilterBar';
import { PreviewModal, DownloadModal } from './DocumentsModals';
import { useUserDocuments } from '../../hooks/useUserDocuments';
import { useAuthWithRedirect } from '../../hooks/useAuthWithRedirect';
import { downloadFile } from '../../utils/documents';

export default function UserDocumentsPage() {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const { documents, loading, fetchDocuments, setDocuments } = useUserDocuments();
  const { session } = useAuthWithRedirect();

  useEffect(() => {
    if (!session) return;
    (async () => {
      let docs = await fetchDocuments({}, session.access_token);
      docs = sortDocuments(docs, sortOrder);
      setDocuments(docs);
    })();
  }, [session]);

  function sortDocuments(docs, order) {
    if (!docs) return [];
    if (order === 'newest') {
      return docs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (order === 'oldest') {
      return docs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (order === 'name-az') {
      return docs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'name-za') {
      return docs.sort((a, b) => b.name.localeCompare(a.name));
    }
    return docs;
  }

  async function handleSearch(e) {
    setSearch(e.target.value);
    if (!session) return;
    let docs = await fetchDocuments({ search: e.target.value }, session.access_token);
    docs = sortDocuments(docs, sortOrder);
    setDocuments(docs);
  }

  async function handleSortChange(e) {
    setSortOrder(e.target.value);
    if (!session) return;
    let docs = await fetchDocuments({ search }, session.access_token);
    docs = sortDocuments(docs, e.target.value);
    setDocuments(docs);
  }

  async function handleFilterChange() {
    if (!session) return;
    let docs = await fetchDocuments({ search }, session.access_token);
    docs = sortDocuments(docs, sortOrder);
    setDocuments(docs);
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
