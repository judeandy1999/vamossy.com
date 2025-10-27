"use client";

import React, { useState, useRef } from 'react';
import UserAssignDropdown from '@/components/documents/UserAssignDropdown';
import FileUploadArea from '@/components/documents/FileUploadArea';
import DocumentTable from '@/components/documents/AdminDocumentsTable';
import PreviewModal from '@/components/documents/PreviewModal';
import DownloadModal from '@/components/documents/DownloadModal';
import CustomModal from '@/components/ui/CustomModal';
import { useAdminDocuments } from '@/hooks/useAdminDocuments';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';

export default function AdminDocumentsPage() {
  const { session, role: authRole, status } = useAuthWithRedirect();
  const ACCEPTED_TYPES = [
    'text/plain', 'text/markdown', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const ACCEPTED_EXTENSIONS = ['.txt', '.md', '.pdf', '.doc', '.docx'];
  const MAX_SIZE = 10 * 1024 * 1024;

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const userDropdownRef = useRef(null);
  const [search, setSearch] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [userFilter, setUserFilter] = useState('');
  const [downloadDoc, setDownloadDoc] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userFilterDropdownOpen, setUserFilterDropdownOpen] = useState(false);
  const [userFilterSearch, setUserFilterSearch] = useState('');
  const userFilterDropdownRef = useRef(null);

  // Add sortOrder state
  const [sortOrder, setSortOrder] = useState('desc'); // default to 'desc', change as needed

  const {
    users,
    documents,
    loading,
    fetchDocuments,
    uploadDocument,
    deleteDocuments,
    downloadDocument,
    role,
    showToast,
  } = useAdminDocuments({ session, role: authRole, status });

  // Add function to sanitize file names
  function sanitizeFileName(fileName) {
    // Remove or replace invalid characters for storage keys
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .substring(0, 200); // Limit length
  }

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
      
      // Sanitize the file name before adding
      const sanitizedFile = new File([file], sanitizeFileName(file.name), {
        type: file.type,
        lastModified: file.lastModified,
      });
      
      accepted.push(sanitizedFile);
    }
    setFiles(prevFiles => {
      const existing = prevFiles.map(f => f.name + '_' + f.size);
      const filtered = accepted.filter(f => !existing.includes(f.name + '_' + f.size));
      return [...prevFiles, ...filtered];
    });
    if (rejected.length && typeof showToast === 'function') {
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

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!files.length || !selectedUsers.length) {
      if (typeof showToast === 'function') showToast('Select files and users', 'warning');
      return;
    }
    setUploading(true);
    let anyError = false;
    for (const file of files) {
      if (!file || !file.name || file.size === 0) {
        if (typeof showToast === 'function') showToast(`Invalid file: ${file?.name || 'unknown'}`, 'error');
        anyError = true;
        continue;
      }
      
      // Additional validation for file name
      const sanitizedName = sanitizeFileName(file.name);
      if (sanitizedName !== file.name) {
        console.log(`File name sanitized: ${file.name} -> ${sanitizedName}`);
      }
      
      for (const userId of selectedUsers) {
        const success = await uploadDocument({ file, userId });
        if (!success) anyError = true;
      }
    }
    setUploading(false);
    if (typeof showToast === 'function') {
      if (anyError) {
        showToast('Some files failed to upload', 'error');
      } else {
        showToast('Files uploaded!', 'success');
      }
    }
    setFiles([]);
    setSelectedUsers([]);
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    fetchDocuments();
  }

  async function handleDeleteConfirmed() {
    if (!selectedDocs.length) return;
    setDeleting(true);
    const filters = { search, userId: userFilter, sort: sortOrder };
    const success = await deleteDocuments(selectedDocs, filters);
    if (success) {
      setSelectedDocs([]);
    }
    setShowDeleteConfirm(false);
    setDeleting(false);
  }

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);
    fetchDocuments({ search: value, userId: userFilter, sort: sortOrder });
  }

  React.useEffect(() => {
    (async () => {
      await fetchDocuments({ search, userId: userFilter, sort: sortOrder });
    })();
  }, [userFilter]);

  const filteredDocuments = React.useMemo(() => {
    if (!userFilter) return documents;
    return documents.filter(doc =>
      Array.isArray(doc.assigned_users) &&
      doc.assigned_users.length === 1 &&
      doc.assigned_users[0] === userFilter
    );
  }, [documents, userFilter]);

  function handleSelectDoc(id) {
    setSelectedDocs(docs => docs.includes(id) ? docs.filter(d => d !== id) : [...docs, id]);
  }


  function handleDownload(doc) {
    setDownloadDoc({ path: doc.url, name: doc.name });
  }

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (userFilterDropdownRef.current && !userFilterDropdownRef.current.contains(event.target)) {
        setUserFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full py-6 px-2 sm:px-4">
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
          <div className="flex flex-col gap-2 md:ml-4">
            <button
              type="submit"
              onClick={handleUpload}
              className={`admin-doc-btn admin-doc-btn--yellow${uploading ? ' admin-doc-btn--loading' : ''}`}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
      <DocumentTable
        documents={filteredDocuments}
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
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
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

      <PreviewModal previewFile={previewFile} previewText={previewText} setPreviewFile={setPreviewFile} />
      <DownloadModal downloadDoc={downloadDoc} setDownloadDoc={setDownloadDoc} downloadFile={downloadDocument} />
    </div>
  );
}
