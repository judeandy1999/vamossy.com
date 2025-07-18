import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/client';
import { useToast } from '../contexts/toast-context';

export function useAdminDocuments({ session, role, status }) {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const sortRef = useRef('created_at');

  const fetchUsers = useCallback(async () => {
    if (role !== 'admin' || !session || status !== 'authenticated') return;
    const { data, error } = await supabase.from('users').select('id, email, name');
    if (error) showToast('Failed to load users', 'error');
    setUsers(data || []);
  }, [role, showToast, session, status]);

  const fetchDocuments = useCallback(async (filters = {}) => {
    if (!session || status !== 'authenticated') return;
    setLoading(true);
    let sort = filters.sort || sortRef.current || 'created_at';
    sortRef.current = sort;
    const params = new URLSearchParams({ ...filters, sort }).toString();
    const token = session?.access_token;
    const res = await fetch(`/api/documents?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { documents } = await res.json();
    setDocuments(documents || []);
    setLoading(false);
  }, [session, status]);

  const uploadDocument = useCallback(async ({ file, userId }) => {
    if (!file || !userId || !session || status !== 'authenticated') return;
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
      showToast(`Upload error: ${storageError.message}`, 'error');
      return false;
    }
    const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath);
    const { data: existing } = await supabase
      .from('documents')
      .select('id')
      .eq('name', file.name)
      .contains('assigned_users', [userId])
      .maybeSingle();
    if (existing) return true;
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
      showToast(`Insert error: ${docError.message}`, 'error');
      return false;
    }
    return true;
  }, [users, showToast, session, status]);

  const deleteDocuments = useCallback(async (ids = [], filters = {}) => {
    if (!ids.length || !session || status !== 'authenticated') return;
    const token = session?.access_token;
    const res = await fetch('/api/documents?delete=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
      credentials: 'include',
    });
    if (res.ok) {
      showToast('Deleted selected documents', 'success');
      fetchDocuments(filters);
      return true;
    } else {
      showToast('Delete failed', 'error');
      return false;
    }
  }, [session, showToast, fetchDocuments, status]);

  const downloadDocument = useCallback(async (fileUrl, fileName) => {
    if (!session || status !== 'authenticated') return;
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
      showToast('Failed to download file: ' + error.message, 'error');
    }
  }, [showToast, session, status]);

  useEffect(() => {
    if (session && status === 'authenticated') {
      fetchUsers();
      fetchDocuments({ sort: sortRef.current });
    }
  }, [fetchUsers, fetchDocuments, session, status]);

  return {
    users,
    documents,
    loading,
    fetchDocuments,
    uploadDocument,
    deleteDocuments,
    downloadDocument,
    role,
    showToast,
  };
}
