'use client';

import { Users, AlertCircle } from 'lucide-react';
import UserRow from './user-row';

export default function UserTable({ 
  displayUsers, 
  error, 
  session, 
  handleRoleChange, 
  updatingUserId 
}) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="relative">
        <div 
          className="max-h-120 overflow-y-auto border-t border-gray-200"
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
                  <UserRow
                    key={user.id}
                    user={user}
                    session={session}
                    handleRoleChange={handleRoleChange}
                    updatingUserId={updatingUserId}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
