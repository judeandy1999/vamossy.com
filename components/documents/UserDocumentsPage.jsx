"use client";
import React, { useState, useEffect } from 'react';

// Helper: fetch documents with filters
async function fetchDocuments(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/documents?${params}`);
  return res.json();
}

export default function UserDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    loadDocuments({ search: e.target.value, dateFrom, dateTo, minSize, maxSize });
  }

  function handleSortChange(e) {
    setSortOrder(e.target.value);
    loadDocuments({ search, dateFrom, dateTo, minSize, maxSize });
  }

  function handleFilterChange() {
    loadDocuments({ search, dateFrom, dateTo, minSize, maxSize });
  }

  function handlePreview(url) {
    setPreviewUrl(url);
  }

  function closePreview() {
    setPreviewUrl(null);
  }

  return (
    <div className="user-documents-page p-6">
      <h2 className="text-2xl font-semibold mb-6">My Documents</h2>
      {/* Professional Filter Bar */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>
          {/* Sort Filter */}
          <div className="w-full md:w-56 flex items-center">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-gray-700 font-medium appearance-none transition-all duration-150 cursor-pointer"
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
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-400">No documents found.</td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{doc.name}</td>
                  <td className="px-4 py-2">{(doc.size / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-2">{doc.type}</td>
                  <td className="px-4 py-2">{new Date(doc.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {doc.type === 'application/pdf' ? (
                      <button onClick={() => handlePreview(doc.url)} className="text-blue-600 hover:underline">Preview</button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="px-4 py-2"><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {previewUrl && (
        <div className="preview-modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto relative">
            <button onClick={closePreview} className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded px-3 py-1 text-sm font-medium">Close</button>
            <iframe src={previewUrl} width="100%" height="600" title="Document Preview" className="border-0 w-full"></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
