'use client';

import { Shield, Mail, ShieldCheck, Briefcase, User } from 'lucide-react';
import Image from 'next/image';
import RoleSelector from './role-selector';

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

export default function UserRow({ 
  user, 
  session, 
  handleRoleChange, 
  updatingUserId 
}) {
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
    <tr className="hover:bg-gray-50">
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
            <RoleSelector 
              user={user}
              handleRoleChange={handleRoleChange}
              updatingUserId={updatingUserId}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
