"use client";

import { AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/client';
import { useToast } from '../../contexts/toast-context';
import CustomModal from '../ui/CustomModal';

// Helper: fetch all users for assignment
async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('id, email, name');
  if (error) throw error;
  return data;
}

// Helper: fetch documents with filters
async function fetchDocuments(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const res = await fetch(`/api/documents?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export default function AdminDocumentsPage() {
  const ACCEPTED_TYPES = [
    'text/plain', 'text/markdown', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const ACCEPTED_EXTENSIONS = ['.txt', '.md', '.pdf', '.doc', '.docx'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  function isAcceptedFile(file) {
    // Check MIME type
    if (ACCEPTED_TYPES.includes(file.type)) return true;
    // Fallback: check extension
    const ext = file.name ? file.name.toLowerCase().slice(file.name.lastIndexOf('.')) : '';
    return ACCEPTED_EXTENSIONS.includes(ext);
  }

  function addFiles(newFiles) {
    let rejected = [];
    let accepted = [];
    for (const file of newFiles) {
      if (!isAcceptedFile(file)) {
        rejected.push(file.name + ' (unsupported format)');
        continue;
      }
      if (file.size > MAX_SIZE) {
        rejected.push(file.name + ' (too large)');
        continue;
      }
      accepted.push(file);
    }
    setFiles(prevFiles => {
      const existing = prevFiles.map(f => f.name + '_' + f.size);
      const filtered = accepted.filter(f => !existing.includes(f.name + '_' + f.size));
      return [...prevFiles, ...filtered];
    });
    if (rejected.length) {
      showToast('Some files were not added: ' + rejected.join(', '), 'error');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
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
  // User filter for table (always userId)
  const [userFilter, setUserFilter] = useState('');
  const [downloadDoc, setDownloadDoc] = useState(null); // { path, name }

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => showToast('Failed to load users', 'error'));
    loadDocuments();
  }, []);

  async function loadDocuments(filters = {}) {
    setLoading(true);
    // Add user filter if set (always use userId)
    const mergedFilters = { ...filters };
    if (userFilter) mergedFilters.userId = userFilter;
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
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles);
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
      // Validate file before upload
      if (!file || !file.name || file.size === 0) {
        showToast(`Invalid file: ${file?.name || 'unknown'}`, 'error');
        anyError = true;
        continue;
      }
      // For each selected user, upload to their folder and insert metadata
      for (const userId of selectedUsers) {
        // Find user email for folder name
        const user = users.find(u => u.id === userId);
        const userEmail = user ? user.email : userId;
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${userEmail}/${fileName}`;
        // Upload to Supabase Storage (bucket: 'documents') in user email folder
        const { data: storageData, error: storageError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });
        if (storageError) {
          console.error('Supabase Storage upload error:', storageError, file);
          showToast(`Upload error: ${storageError.message}`, 'error');
          anyError = true;
          continue;
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath);

        // Check for duplicate for this user
        const { data: existing, error: checkError } = await supabase
          .from('documents')
          .select('id')
          .eq('name', file.name)
          .contains('assigned_users', [userId])
          .maybeSingle();

        if (existing) {
          // Skip duplicate for this user
          continue;
        }

        // Insert metadata into 'documents' table
        const { error: docError } = await supabase
          .from('documents')
          .insert([
            {
              name: file.name,
              url: publicUrlData.publicUrl,
              size: file.size,
              type: file.type,
              assigned_users: [userId],
              created_at: new Date().toISOString(),
            },
          ]);
        if (docError) {
          anyError = true;
          console.error('Supabase documents insert error:', docError);
          showToast(`Insert error: ${docError.message}`, 'error');
        }
      }
    }
    setUploading(false);
    if (anyError) {
      showToast('Some files failed to upload', 'error');
    } else {
      showToast('Files uploaded!', 'success');
    }
    setFiles([]);
    setSelectedUsers([]);
    // Reset file input so user can select same files again
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    loadDocuments();
  }

  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteConfirmed() {
    if (!selectedDocs.length) return;
    setDeleting(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const res = await fetch('/api/documents?delete=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedDocs }),
        credentials: 'include',
      });
      if (res.ok) {
        showToast('Deleted selected documents', 'success');
        setSelectedDocs([]);
        loadDocuments();
      } else {
        showToast('Delete failed', 'error');
      }
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    loadDocuments({ search: e.target.value });
  }

  // Handle user filter change
  // User filter handler for dropdown (always userId)
  function handleUserFilter(userId) {
    setUserFilter(userId);
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

  function handleDownload(doc) {
    setDownloadDoc({ path: doc.url, name: doc.name });
  }

  async function downloadFile(fileUrl, fileName) {
    try {
      let path = fileUrl;
      // If fileUrl is a public URL, extract the storage path after '/object/public/documents/'
      const match = fileUrl.match(/\/object\/public\/(documents\/[^?]+)/);
      if (match && match[1]) {
        path = match[1];
      }
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
        <div className="p-6 flex flex-col md:flex-row md:items-end gap-2 bg-gray-50 rounded-lg">
          <div className="flex-1 grid md:grid-cols-2 gap-5">
            {/* Assign to users dropdown */}
            <div className="flex flex-col min-w-0 max-w-[500px] relative justify-start">
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
            <div className="flex flex-col min-w-0 max-w-[500px] justify-start">
              <label className="font-medium mb-1">Upload files:</label>
              <div
                className={`border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors ${files.length ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-50'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
                style={{ minHeight: 120 }}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                {files.length ? (
                  <div>
                    <p className="font-medium mb-2">{files.length} file(s) selected</p>
                    <ul
                      className="text-sm text-gray-700 mb-2"
                      style={files.length > 3 ? { maxHeight: '66px', overflowY: 'auto', border: '1px solid #ffe082', borderRadius: '6px', background: '#fffde7', padding: '4px' } : {}}
                    >
                      {files.map((file, idx) => (
                        <li key={idx} className="flex items-center group pr-2">
                          <span className="truncate flex-grow mr-1 flex items-center min-w-0 group-hover:bg-yellow-100 group-hover:text-yellow-800 transition-colors duration-150 rounded" style={{maxWidth: '100%'}}>{file.name}</span>
                          <button
                            type="button"
                            className="flex items-center text-gray-400 hover:text-red-500 text-base font-bold focus:outline-none border border-gray-300 rounded-full bg-white transition-all duration-150 hover:scale-110"
                            style={{marginLeft: '4px', height: '20px', width: '24px', justifyContent: 'center'}} 
                            title="Remove file"
                            onMouseEnter={e => e.currentTarget.parentElement.classList.add('hovering-x')}
                            onMouseLeave={e => e.currentTarget.parentElement.classList.remove('hovering-x')}
                            onClick={e => {
                              e.stopPropagation();
                              setFiles(prev => prev.filter((_, i) => i !== idx));
                            }}
                          >
                            <span style={{lineHeight: 1}}>×</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="text-xs text-red-500 underline"
                      onClick={e => {
                        e.stopPropagation();
                        setFiles([]);
                        // Reset file input so user can select same files again
                        const fileInput = document.getElementById('fileInput');
                        if (fileInput) fileInput.value = '';
                      }}
                    >Clear</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg width="40" height="40" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 48 48" className="mx-auto mb-2">
                      <path d="M24 34V14M24 14l-7 7m7-7l7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="8" y="36" width="32" height="4" rx="2" fill="#e5e7eb"/>
                    </svg>
                    <span className="text-gray-500 text-sm">
                      <span className="text-yellow-600 font-medium cursor-pointer underline" style={{cursor:'pointer'}}>Upload a file</span> or drag and drop
                    </span>
                    <span className="text-xs text-gray-400 mt-1">TXT, MD, PDF, DOC up to 10MB</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleUpload}
            className={`mt-6 md:mt-0 admin-doc-btn bg-yellow-500 hover:bg-yellow-600 text-white ${uploading ? 'admin-doc-btn--loading' : ''}`}
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
              ) : previewFile.file.type === 'application/pdf' ? (
                <iframe src={previewFile.url} width="100%" height="500" title="PDF Preview" className="border-0 w-full bg-gray-50 rounded" />
              ) : (
                <div className="text-gray-500 text-sm">
                  No preview available. <a href={previewFile.url} download={previewFile.file.name} className="text-blue-600 underline">Download</a>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Document Table */}
        <div className="overflow-x-auto mt-8 border border-gray-200 bg-white rounded shadow-sm max-h-[600px]">
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
                          onClick={() => { handleUserFilter(u.id); setUserFilterDropdownOpen(false); setUserFilterSearch(''); }}
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
                  if (val === 'name') sorted.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
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
              className={`admin-doc-btn bg-red-500 hover:bg-red-600 text-white ${(selectedDocs.length === 0 || deleting) ? 'admin-doc-btn--loading' : ''}`}
              onClick={() => setShowDeleteConfirm(true)}
              disabled={selectedDocs.length === 0 || deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Selected'}
            </button>
    {/* Delete Confirmation Modal */}
    <CustomModal
      isOpen={showDeleteConfirm}
      onClose={() => deleting ? null : setShowDeleteConfirm(false)}
      title="Delete Documents"
      actions={[
        <button key="cancel" onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all" disabled={deleting}>Cancel</button>,
        <button key="delete" onClick={handleDeleteConfirmed} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition-all" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      ]}
    >
      <span>Are you sure you want to delete <span className="font-medium text-gray-900">{selectedDocs.length}</span> document{selectedDocs.length !== 1 ? 's' : ''}? This action cannot be undone.</span>
    </CustomModal>
          </div>
          <table className="w-full divide-y divide-gray-200 min-h-[180px]">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
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
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500 text-sm">No documents found.</td>
                </tr>
              ) : (
                documents.map(doc => (
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
    {/* Consistent button styles for Upload and Delete Selected */}
    <style jsx>{`
      .admin-doc-btn {
        min-width: 140px;
        padding: 0.75rem 0;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
        transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.12s;
        outline: none;
        border: none;
        display: inline-block;
        text-align: center;
        line-height: 1.25;
      }
      .admin-doc-btn:hover:not(:disabled) {
        transform: scale(1.04);
        box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08);
      }
      .admin-doc-btn:active:not(:disabled) {
        transform: scale(0.98);
      }
      .admin-doc-btn:disabled,
      .admin-doc-btn--loading {
        opacity: 0.7;
        cursor: not-allowed;
        min-width: 140px;
        pointer-events: none;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
      }
    `}</style>
    <CustomModal
      isOpen={!!previewFile}
      onClose={() => {
        if (previewFile && previewFile.url) URL.revokeObjectURL(previewFile.url);
        setPreviewFile(null);
      }}
      title={previewFile?.file?.name || 'Preview'}
      actions={null}
    >
      {previewFile && (
        previewFile.file.type.startsWith('image/') ? (
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
        )
      )}
    </CustomModal>
    <CustomModal
      isOpen={!!downloadDoc}
      onClose={() => setDownloadDoc(null)}
      title="Download Document"
      actions={[
        <button key="cancel" onClick={() => setDownloadDoc(null)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">Cancel</button>,
        <button key="download" onClick={async () => {
          if (!downloadDoc) return;
          await downloadFile(downloadDoc.path, downloadDoc.name);
          setDownloadDoc(null);
        }} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all">Download</button>
      ]}
    >
      {downloadDoc && (
        <span>Are you sure you want to download <span className="font-medium text-gray-900">{downloadDoc.name}</span>?</span>
      )}
    </CustomModal>
  </div>
  );
}
