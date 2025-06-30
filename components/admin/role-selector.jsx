'use client';

import { ShieldCheck, Briefcase, User } from 'lucide-react';

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

export default function RoleSelector({ 
  user, 
  handleRoleChange, 
  updatingUserId 
}) {
  return (
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
  );
}
