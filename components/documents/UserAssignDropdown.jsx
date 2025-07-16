import React, { useRef } from 'react';

export default function UserAssignDropdown({ users, selectedUsers, setSelectedUsers, userDropdownOpen, setUserDropdownOpen, userSearch, setUserSearch }) {
  const userDropdownRef = useRef(null);

  function handleUserSelect(id) {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  }

  return (
    <div className="flex flex-col min-w-0 max-w-[500px] relative justify-start">
      <label className="font-medium mb-1">Assign to users:</label>
      <div ref={userDropdownRef}>
        <div
          className="min-w-[200px] border rounded px-2 py-1 bg-white cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 overflow-x-auto h-[40px] min-h-[40px] max-h-[40px]"
          tabIndex={0}
          onClick={() => setUserDropdownOpen(v => !v)}
          style={{ height: '40px', minHeight: '40px', maxHeight: '40px' }}
        >
          {selectedUsers.length === 0 ? (
            <span className="text-gray-400">Select users...</span>
          ) : (
            <span className="text-yellow-700 text-xs font-medium">{selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected</span>
          )}
          <span className="ml-auto text-gray-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
        {userDropdownOpen && (
          <div className="absolute left-0 right-0 z-40 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto w-full">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
            <ul className="max-h-40 overflow-y-auto">
              {users.filter(u => (u.name || u.email).toLowerCase().includes(userSearch.toLowerCase())).length === 0 && (
                <li className="px-4 py-2 text-gray-400 text-sm">No users found</li>
              )}
              {users.filter(u => (u.name || u.email).toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                <li
                  key={u.id}
                  className="px-4 py-2 hover:bg-yellow-50 flex items-center cursor-pointer"
                  onClick={() => handleUserSelect(u.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.id)}
                    onChange={e => { e.stopPropagation(); handleUserSelect(u.id); }}
                    className="mr-2 cursor-pointer"
                  />
                  <span>{u.name || u.email}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Selected users tags below dropdown */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUsers.map(uid => {
            const user = users.find(u => u.id === uid);
            return (
              <span key={uid} className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                {user ? user.name || user.email : uid}
                <button
                  type="button"
                  className="ml-1 text-yellow-700 hover:text-red-500 focus:outline-none"
                  onClick={() => handleUserSelect(uid)}
                  aria-label={`Remove ${user ? user.name || user.email : uid}`}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
