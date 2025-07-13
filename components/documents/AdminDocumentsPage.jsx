"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/client';
import { useToast } from '../../contexts/toast-context';

// Helper: fetch all users for assignment
async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('id, email, name');
  if (error) throw error;
  return data;
}

// Helper: fetch documents with filters
async function fetchDocuments(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/documents?${params}`);
  return res.json();
}

export default function AdminDocumentsPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const userDropdownRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null); // { file, url }
  const [previewText, setPreviewText] = useState(null);
  // User filter for table
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => showToast('Failed to load users', 'error'));
    loadDocuments();
  }, []);

  async function loadDocuments(filters = {}) {
    setLoading(true);
    // Add user filter if set
    const mergedFilters = { ...filters };
    if (userFilter) mergedFilters.user = userFilter;
    const { documents } = await fetchDocuments(mergedFilters);
    setDocuments(documents || []);
    setLoading(false);
  }

  function handleUserSelect(id) {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  }

  // For closing dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  function handleFileChange(e) {
    setFiles(Array.from(e.target.files));
  }
  
  function handlePreviewFile(file) {
    const url = URL.createObjectURL(file);
    setPreviewFile({ file, url });
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!files.length || !selectedUsers.length) {
      showToast('Select files and users', 'warning');
      return;
    }
    setUploading(true);
    let anyError = false;
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      // Upload to Supabase Storage (bucket: 'documents')
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });
      if (storageError) {
        anyError = true;
        continue;
      }
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(fileName);
      // Insert metadata into 'documents' table
      const { error: docError } = await supabase
        .from('documents')
        .insert([
          {
            name: file.name,
            url: publicUrlData.publicUrl,
            size: file.size,
            type: file.type,
            assigned_users: selectedUsers,
            created_at: new Date().toISOString(),
            // uploaded_by: add user id if available in your auth context
          },
        ]);
      if (docError) {
        anyError = true;
      }
    }
    setUploading(false);
    if (anyError) {
      showToast('Some files failed to upload', 'error');
    } else {
      showToast('Files uploaded!', 'success');
    }
    setFiles([]);
    loadDocuments();
  }

  async function handleDelete() {
    if (!selectedDocs.length) return;
    const res = await fetch('/api/documents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedDocs }),
    });
    if (res.ok) {
      showToast('Deleted selected documents', 'success');
      setSelectedDocs([]);
      loadDocuments();
    } else {
      showToast('Delete failed', 'error');
    }
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    loadDocuments({ search: e.target.value });
  }

  // Handle user filter change
  function handleUserFilter(e) {
    setUserFilter(e.target.value);
  }

  // Reload documents when userFilter changes
  useEffect(() => {
    loadDocuments({ search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilter]);

  function handleSelectDoc(id) {
    setSelectedDocs(docs => docs.includes(id) ? docs.filter(d => d !== id) : [...docs, id]);
  }

  // State for user filter dropdown
  const [userFilterDropdownOpen, setUserFilterDropdownOpen] = useState(false);
  const [userFilterSearch, setUserFilterSearch] = useState('');
  const userFilterDropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (userFilterDropdownRef.current && !userFilterDropdownRef.current.contains(event.target)) {
        setUserFilterDropdownOpen(false);
      }
    }
    if (userFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userFilterDropdownOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          Document Management
        </h1>
        <p className="text-gray-600 mt-2">Upload, assign, and manage user documents</p>
      </div>

      {/* Upload & Assign Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 flex flex-col md:flex-row md:items-end gap-4 bg-gray-50 rounded-lg">
          <div className="flex-1 grid md:grid-cols-2 gap-8">
            {/* Assign to users dropdown */}
            <div className="flex flex-col min-w-0 max-w-[400px] relative justify-start">
              <label className="font-medium mb-1">Assign to users:</label>
              <div ref={userDropdownRef}>
                <div
                  className="min-w-[200px] border rounded px-2 py-1 bg-white cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 overflow-x-auto h-[40px] min-h-[40px] max-h-[40px]"
                  tabIndex={0}
                  onClick={() => setUserDropdownOpen(v => !v)}
                  style={{ height: '40px', minHeight: '40px', maxHeight: '40px' }}
                >
                  {selectedUsers.length === 0 ? (
                    <span className="text-gray-400">Select users...</span>
                  ) : (
                    <span className="text-yellow-700 text-xs font-medium">{selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected</span>
                  )}
                  <span className="ml-auto text-gray-400">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </div>
                {userDropdownOpen && (
                  <div className="absolute left-0 right-0 z-40 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto w-full">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      />
                    </div>
                    <ul className="max-h-40 overflow-y-auto">
                      {users.filter(u => (u.name || u.email).toLowerCase().includes(userSearch.toLowerCase())).length === 0 && (
                        <li className="px-4 py-2 text-gray-400 text-sm">No users found</li>
                      )}
                      {users.filter(u => (u.name || u.email).toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                        <li
                          key={u.id}
                          className="px-4 py-2 hover:bg-yellow-50 flex items-center cursor-pointer"
                          onClick={() => handleUserSelect(u.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.id)}
                            onChange={e => { e.stopPropagation(); handleUserSelect(u.id); }}
                            className="mr-2 cursor-pointer"
                          />
                          <span>{u.name || u.email}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Selected users tags below dropdown */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map(uid => {
                    const user = users.find(u => u.id === uid);
                    return (
                      <span key={uid} className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                        {user ? user.name || user.email : uid}
                        <button
                          type="button"
                          className="ml-1 text-yellow-700 hover:text-red-500 focus:outline-none"
                          onClick={() => handleUserSelect(uid)}
                          aria-label={`Remove ${user ? user.name || user.email : uid}`}
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Upload files section */}
            <div className="flex flex-col min-w-0 max-w-[400px] justify-start">
              <label className="font-medium mb-1">Upload files:</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {files.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  <div className="font-medium mb-1">Selected files:</div>
                  <ul className="list-disc pl-5">
                    {files.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <a
                          href={URL.createObjectURL(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[200px]"
                          title={file.name}
                          onClick={e => {
                            setTimeout(() => URL.revokeObjectURL(URL.createObjectURL(file)), 10000);
                          }}
                        >
                          {file.name}
                        </a>
                        <span className="text-gray-400 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            onClick={handleUpload}
            className="mt-6 md:mt-0 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Filter/Search/Sort Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        {/* File Preview Modal */}
        {previewFile && (
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
              ) : (
                <div className="text-gray-500 text-sm">
                  No preview available. <a href={previewFile.url} download={previewFile.file.name} className="text-blue-600 underline">Download</a>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Document Table */}
        <div className="overflow-x-auto mt-8 border border-gray-200 bg-white rounded shadow-sm min-h-[220px]">
          {/* User Filter Searchable Dropdown */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 px-2 py-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 mb-2 md:mb-0 min-w-[220px] relative" ref={userFilterDropdownRef}>
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
                onChange={e => {
                  const val = e.target.value;
                  let sorted = [...documents];
                  if (val === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
                  else if (val === 'date') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                  else if (val === 'type') sorted.sort((a, b) => a.type.localeCompare(b.type));
                  setDocuments(sorted);
                }}
                defaultValue="date"
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
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
              onClick={handleDelete}
              disabled={selectedDocs.length === 0}
            >
              Delete Selected
            </button>
          </div>
          <table className="w-full divide-y divide-gray-200 min-h-[180px]">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Users</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-400 text-sm">Loading...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500 text-sm">No documents found.</td>
                </tr>
              ) : (
                documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2"><input type="checkbox" checked={selectedDocs.includes(doc.id)} onChange={() => handleSelectDoc(doc.id)} /></td>
                    <td className="px-4 py-2">{doc.name}</td>
                    <td className="px-4 py-2">{(doc.assigned_users || []).length}</td>
                    <td className="px-4 py-2">{(doc.size / 1024).toFixed(1)} KB</td>
                    <td className="px-4 py-2">{doc.type}</td>
                    <td className="px-4 py-2">{new Date(doc.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2"><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
