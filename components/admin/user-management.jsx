'use client';

import { useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { Users } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import UserStatsCards from './user-stats-cards';
import UserFilters from './user-filters';
import UserTable from './user-table';
import FeedbackMessage from './feedback-message';

export default function UserManagement() {
  const { role: currentUserRole, session, status } = useAuthWithRedirect();
  const {
    users,
    loading,
    error,
    updateUserRole,
    getUserStats,
    searchUsers,
    filterUsersByRole,
  } = useUserManagement(session);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleRoleChange = async (user, newRole) => {
    if (!user || !newRole || newRole === user.role) return;

    setUpdatingUserId(user.id);
    try {
      await updateUserRole(user.id, newRole);
      setFeedback({
        type: 'success',
        message: `Successfully updated ${user.email} to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message
      });
    } finally {
      setUpdatingUserId(null);
    }

    // Clear feedback after 5 seconds
    setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
  };

  // Show loading spinner while authentication is being verified or data is loading
  if (status === 'loading' || loading) {
    return <Spinner />;
  }

  // If authenticated but no users data and no error, we're still loading
  if (status === 'authenticated' && users.length === 0 && !error) {
    return <Spinner />;
  }

  const stats = getUserStats();
  const filteredUsers = searchUsers(searchTerm);
  const displayUsers = roleFilter === 'all' ? filteredUsers : filterUsersByRole(roleFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Role Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage user roles across the platform
          </p>
        </div>
      </div>

      {/* Feedback Messages */}
      <FeedbackMessage feedback={feedback} />

      {/* Stats Cards */}
      <UserStatsCards stats={stats} />

      {/* Filters and Search */}
      <UserFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* Users Table */}
      <UserTable 
        displayUsers={displayUsers}
        error={error}
        session={session}
        handleRoleChange={handleRoleChange}
        updatingUserId={updatingUserId}
      />
    </div>
  );
}
