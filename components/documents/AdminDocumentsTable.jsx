import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';

export default function DocumentTable({
  documents,
  users,
  loading,
  selectedDocs,
  setSelectedDocs,
  handleSelectDoc,
  setPreviewFile,
  setPreviewText,
  handleDownload,
  search,
  handleSearch,
  userFilter,
  setUserFilter,
  userFilterDropdownOpen,
  setUserFilterDropdownOpen,
  userFilterSearch,
  setUserFilterSearch,
  deleting,
  setShowDeleteConfirm
}) {

  const [sort, setSort] = useState('date');
  const [sortedDocuments, setSortedDocuments] = useState([]);

  useEffect(() => {
    let sorted = [...documents];
    if (sort === 'name') sorted.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    else if (sort === 'date') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else if (sort === 'type') sorted.sort((a, b) => a.type.localeCompare(b.type));
    setSortedDocuments(sorted);
  }, [documents, sort]);

  return (
    <div className="px-2 sm:px-4 w-full">
      <div className="overflow-x-auto max-h-[600px]">
        <div className="flex flex-col md:flex-row md:items-center gap-2 px-2 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2 mb-2 md:mb-0 min-w-[220px] relative">
          <div className="flex items-center gap-2 w-full" style={{ minWidth: 0 }}>
            <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Filter by user:</label>
            <div className="min-w-[140px] w-full" style={{ position: 'relative' }}>
              <div
                className="border rounded px-2 py-1 bg-white cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                tabIndex={0}
                onClick={() => setUserFilterDropdownOpen(v => !v)}
                style={{ minHeight: '36px' }}
              >
                {userFilter
                  ? (
                      <span className="truncate text-sm">
                        {users.find(u => u.id === userFilter)?.name || users.find(u => u.id === userFilter)?.email || 'Unknown user'}
                      </span>
                    )
                  : <span className="text-gray-400 text-sm">All Users</span>
                }
                <span className="ml-auto text-gray-400">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </div>
              {userFilterDropdownOpen && (
                <div className="absolute left-0 right-0 z-40 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto w-full">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userFilterSearch}
                      onChange={e => setUserFilterSearch(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <ul className="max-h-40 overflow-y-auto">
                    <li
                      className={`px-4 py-2 cursor-pointer hover:bg-yellow-50 text-sm ${!userFilter ? 'font-semibold text-yellow-700' : 'text-gray-700'}`}
                      onClick={() => { setUserFilter(''); setUserFilterDropdownOpen(false); setUserFilterSearch(''); }}
                    >
                      All Users
                    </li>
                    {users.filter(u => (u.name || u.email).toLowerCase().includes(userFilterSearch.toLowerCase())).length === 0 && (
                      <li className="px-4 py-2 text-gray-400 text-sm">No users found</li>
                    )}
                    {users.filter(u => (u.name || u.email).toLowerCase().includes(userFilterSearch.toLowerCase())).map(u => (
                    <li
                      key={u.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-yellow-50 text-sm ${userFilter === u.id ? 'font-semibold text-yellow-700' : 'text-gray-700'}`}
                      onClick={() => { setUserFilter(u.id); setUserFilterDropdownOpen(false); setUserFilterSearch(''); }}
                    >
                      {u.name || u.email}
                    </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <select
            className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            onChange={e => setSort(e.target.value)}
            value={sort}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search documents..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
            />
            <span className="absolute left-2 top-2.5 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
        </div>
        <button
          type="button"
          className={`admin-doc-btn admin-doc-btn--red ${(selectedDocs.length === 0 || deleting) ? 'admin-doc-btn--loading' : ''}`}
          onClick={() => setShowDeleteConfirm(true)}
          disabled={selectedDocs.length === 0 || deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Selected'}
        </button>
        </div>
        <table className="w-full divide-y divide-gray-200 min-h-[180px]">
        <thead className="bg-gray-50 sticky top-[56px] z-10">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={documents.length > 0 && selectedDocs.length === documents.length}
                indeterminate={selectedDocs.length > 0 && selectedDocs.length < documents.length ? 'true' : undefined}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedDocs(documents.map(doc => doc.id));
                  } else {
                    setSelectedDocs([]);
                  }
                }}
                aria-label="Select all documents"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Users</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-400 text-sm">Loading...</td>
            </tr>
          ) : sortedDocuments.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500 text-sm">No documents found.</td>
            </tr>
          ) : (
            sortedDocuments.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-4 py-2"><input type="checkbox" checked={selectedDocs.includes(doc.id)} onChange={() => handleSelectDoc(doc.id)} /></td>
                <td className="px-4 py-2">{doc.name}</td>
                <td className="px-4 py-2">
                  {(doc.assigned_users || []).length === 0
                    ? <span className="text-gray-400 text-xs">None</span>
                    : (doc.assigned_users || []).map((uid, idx) => {
                        const user = users.find(u => u.id === uid);
                        return (
                          <span key={uid} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs mr-1">
                            {user ? (user.name || user.email) : uid}
                            {idx < doc.assigned_users.length - 1 ? ', ' : ''}
                          </span>
                        );
                      })
                  }
                </td>
                <td className="px-4 py-2">{(doc.size / 1024).toFixed(1)} KB</td>
                <td className="px-4 py-2">{doc.type}</td>
                <td className="px-4 py-2">{new Date(doc.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 text-center align-middle">
                  {(doc.type && (doc.type.startsWith('image/') || doc.type === 'application/pdf')) ? (
                    <button
                      className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm inline-flex items-center gap-2"
                      style={{ minWidth: 90 }}
                      onClick={() => {
                        setPreviewFile({ file: { name: doc.name, type: doc.type }, url: doc.url });
                        setPreviewText(null);
                        if (doc.type.startsWith('text/')) {
                          fetch(doc.url).then(r => r.text()).then(setPreviewText);
                        }
                      }}
                    >
                      <AiOutlineEye size={18} className="inline-block align-middle" />
                      Preview
                    </button>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center align-middle">
                  <button
                    className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-300 text-sm inline-flex items-center gap-2"
                    style={{ minWidth: 90 }}
                    onClick={() => handleDownload(doc)}
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
    </div>
  );
}
