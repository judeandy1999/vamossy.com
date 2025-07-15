"use client";

import React, { useState, useEffect, useRef } from 'react';
import UserAssignDropdown from './UserAssignDropdown';
import FileUploadArea from './FileUploadArea';
import DocumentTable from './AdminDocumentsTable';
import PreviewModal from './PreviewModal';
import DownloadModal from './DownloadModal';
import { supabase } from '../../utils/client';
import { useToast } from '../../contexts/toast-context';
import CustomModal from '../ui/CustomModal';

async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('id, email, name');
  if (error) throw error;
  return data;
}

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
  const MAX_SIZE = 10 * 1024 * 1024;

  function isAcceptedFile(file) {
    if (ACCEPTED_TYPES.includes(file.type)) return true;
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
  const [previewFile, setPreviewFile] = useState(null); 
  const [previewText, setPreviewText] = useState(null);
  const [userFilter, setUserFilter] = useState('');
  const [downloadDoc, setDownloadDoc] = useState(null); 

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => showToast('Failed to load users', 'error'));
    loadDocuments();
  }, []);

  async function loadDocuments(filters = {}) {
    setLoading(true);
    const mergedFilters = { ...filters };
    if (userFilter) mergedFilters.userId = userFilter;
    const { documents } = await fetchDocuments(mergedFilters);
    setDocuments(documents || []);
    setLoading(false);
  }

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

  async function handleUpload(e) {
    e.preventDefault();
    if (!files.length || !selectedUsers.length) {
      showToast('Select files and users', 'warning');
      return;
    }
    setUploading(true);
    let anyError = false;
    for (const file of files) {
      
      if (!file || !file.name || file.size === 0) {
        showToast(`Invalid file: ${file?.name || 'unknown'}`, 'error');
        anyError = true;
        continue;
      }
      
      for (const userId of selectedUsers) {
        
        const user = users.find(u => u.id === userId);
        const userEmail = user ? user.email : userId;
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${userEmail}/${fileName}`;
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
        const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath);

        const { data: existing, error: checkError } = await supabase
          .from('documents')
          .select('id')
          .eq('name', file.name)
          .contains('assigned_users', [userId])
          .maybeSingle();

        if (existing) {
          continue;
        }

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
   
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    loadDocuments();
  }

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

  useEffect(() => {
    loadDocuments({ search });
  }, [userFilter]);

  function handleSelectDoc(id) {
    setSelectedDocs(docs => docs.includes(id) ? docs.filter(d => d !== id) : [...docs, id]);
  }

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
            <UserAssignDropdown
              users={users}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
            />
            <FileUploadArea
              files={files}
              setFiles={setFiles}
              handleFileChange={handleFileChange}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <button
            type="submit"
            onClick={handleUpload}
            className={`mt-6 md:mt-0 admin-doc-btn admin-doc-btn--yellow${uploading ? ' admin-doc-btn--loading' : ''}`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <DocumentTable
          documents={documents}
          users={users}
          loading={loading}
          selectedDocs={selectedDocs}
          setSelectedDocs={setSelectedDocs}
          handleSelectDoc={handleSelectDoc}
          setPreviewFile={setPreviewFile}
          setPreviewText={setPreviewText}
          handleDownload={handleDownload}
          search={search}
          handleSearch={handleSearch}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          userFilterDropdownOpen={userFilterDropdownOpen}
          setUserFilterDropdownOpen={setUserFilterDropdownOpen}
          userFilterSearch={userFilterSearch}
          setUserFilterSearch={setUserFilterSearch}
          deleting={deleting}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
        {/* Delete confirmation modal remains as CustomModal for now */}
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
    
    {/* Tailwind classes now handle all button styling; removed <style jsx> block. */}
    <PreviewModal previewFile={previewFile} previewText={previewText} setPreviewFile={setPreviewFile} />
    <DownloadModal downloadDoc={downloadDoc} setDownloadDoc={setDownloadDoc} downloadFile={downloadFile} />
  </div>
  );
}
