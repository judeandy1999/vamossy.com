import { useState, useCallback } from 'react';

export function useUserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user documents
  const fetchDocuments = useCallback(async (filters = {}, token) => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/documents?${params}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const { documents } = await res.json();
    setDocuments(documents || []);
    setLoading(false);
    return documents || [];
  }, []);

  return {
    documents,
    loading,
    fetchDocuments,
    setDocuments,
    setLoading,
  };
}
