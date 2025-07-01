import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';

export function useUserManagement(session) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    if (!session?.user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = session?.access_token;
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    if (!session?.user) throw new Error('Authentication required');
    
    try {
      const accessToken = session?.access_token;
      const response = await fetch('/api/users/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user role');
      }

      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, role: newRole }
            : user
        )
      );

      return { success: true, message: data.message };
    } catch (err) {
      console.error('Error updating user role:', err);
      throw new Error(err.message);
    }
  };

  const getUserStats = () => {
    const stats = {
      total: users.length,
      admin: users.filter(user => user.role === 'admin').length,
      worker: users.filter(user => user.role === 'worker').length,
      user: users.filter(user => user.role === 'user').length,
    };
    return stats;
  };

  const searchUsers = (searchTerm) => {
    if (!searchTerm.trim()) return users;
    
    return users.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterUsersByRole = (role) => {
    if (role === 'all') return users;
    return users.filter(user => user.role === role);
  };

  const sortUsers = (users, sortOrder) => {
    if (!sortOrder || sortOrder === 'default') return users;
    
    const sortedUsers = [...users];
    
    if (sortOrder === 'alphabetical') {
      return sortedUsers.sort((a, b) => {
        // Sort by name first, if name doesn't exist, use email
        const nameA = (a.name || a.email || '').toLowerCase();
        const nameB = (b.name || b.email || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }
    
    if (sortOrder === 'creation') {
      return sortedUsers.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA; // Most recent first
      });
    }
    
    return sortedUsers;
  };

  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session?.user?.id]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole,
    getUserStats,
    searchUsers,
    filterUsersByRole,
    sortUsers,
  };
}
