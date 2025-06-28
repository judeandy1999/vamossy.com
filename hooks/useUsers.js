'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      showToastRef.current('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  // Only fetch once on mount
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array

  return {
    users,
    loading,
    error,
    refetchUsers: fetchUsers
  };
}