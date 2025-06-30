'use client';

import { useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  ShieldCheck, 
  User, 
  Briefcase,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Image from 'next/image';

const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    color: 'bg-red-100 text-red-800',
    icon: ShieldCheck,
    description: 'Full system access, can manage users and content'
  },
  worker: {
    label: 'Worker',
    color: 'bg-blue-100 text-blue-800',
    icon: Briefcase,
    description: 'Can complete tasks and access work features'
  },
  user: {
    label: 'User',
    color: 'bg-green-100 text-green-800',
    icon: User,
    description: 'Basic access, can view and interact with content'
  }
};

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
  const [updating, setUpdating] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const getDisplayName = (currentUser) => {
    if (!currentUser) return 'U';

    if (currentUser?.name) {
      return currentUser?.name;
    }
    
    if (currentUser?.email) {
      return currentUser?.email.split('@')[0]
    }
    
    return 'User';
  }

  const getInitials = (user) => {
    const displayName = getDisplayName(user)
    return displayName.charAt(0).toUpperCase()
  }

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

  const handleRoleChange = async (user, newRole) => {
    if (!user || !newRole || newRole === user.role) return;

    setUpdatingUserId(user.id);
    try {
      await updateUserRole(user.id, newRole);
      setFeedback({
        type: 'success',
        message: `Successfully updated ${user.email} to ${ROLE_CONFIG[newRole].label}`
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

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
      {feedback.message && (
        <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
          feedback.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.admin}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Workers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.worker}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Regular Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.user}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Role Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="worker">Workers</option>
                  <option value="user">Users</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="relative">
          <div 
            className="max-h-140 overflow-y-auto border-t border-gray-200"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#D1D5DB #F3F4F6'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: #F3F4F6;
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb {
                background: #D1D5DB;
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: #9CA3AF;
              }
            `}</style>
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2 bg-gray-50">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4 bg-gray-50">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4 bg-gray-50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {displayUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    {error ? (
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Error: {error}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-5 w-5" />
                        No users found
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                displayUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap w-1/2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {user.avatar_url ? (
                                <Image
                                    src={user.avatar_url}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover rounded-full"
                                />
                                ) : (
                                <span className="font-medium text-slate-700">{getInitials(user)}</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-1/4">
                      <div className="text-sm text-gray-900">
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/4">
                      <div className="flex gap-2">
                        {user.id === session?.user?.id ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-400">
                            <Shield className="h-3 w-3" />
                            You
                          </span>
                        ) : (
                          <div className="relative group isolate">
                            {/* Role Icon Display */}
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                              {(() => {
                                const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                                const Icon = config.icon;
                                return <Icon className="h-3 w-3 text-gray-600" />;
                              })()}
                            </div>
                            
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user, e.target.value)}
                              disabled={updatingUserId === user.id}
                              className={`relative z-0 w-28 pl-6 pr-6 py-1.5 rounded-md text-xs font-medium border focus:outline-none appearance-none transition-all duration-200 ${
                                updatingUserId === user.id
                                  ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                                  : user.role === 'admin'
                                  ? 'border-red-200 bg-red-50 text-red-700 hover:border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100'
                                  : user.role === 'worker'
                                  ? 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-100'
                                  : 'border-green-200 bg-green-50 text-green-700 hover:border-green-300 focus:border-green-400 focus:ring-1 focus:ring-green-100'
                              } group-hover:shadow-sm`}
                            >
                              {Object.entries(ROLE_CONFIG).map(([roleKey, config]) => (
                                <option 
                                  key={roleKey} 
                                  value={roleKey}
                                  className="py-2 px-3 text-gray-900 bg-white"
                                >
                                  {config.label}
                                </option>
                              ))}
                            </select>
                            
                            {/* Custom Dropdown Arrow or Loading Spinner */}
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              {updatingUserId === user.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent"></div>
                              ) : (
                                <div className="transition-transform duration-200 group-hover:scale-110">
                                  <svg className="h-3 w-3 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            {/* Subtle glow effect on focus */}
                            <div className={`absolute inset-0 rounded-md pointer-events-none transition-opacity duration-200 ${
                              user.role === 'admin'
                                ? 'bg-red-400 opacity-0 group-hover:opacity-3'
                                : user.role === 'worker'
                                ? 'bg-blue-400 opacity-0 group-hover:opacity-3'
                                : 'bg-green-400 opacity-0 group-hover:opacity-3'
                            }`}></div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
