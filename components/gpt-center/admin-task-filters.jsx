'use client';

import { Search, Filter } from 'lucide-react';

export default function AdminTaskFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  frequencyFilter,
  setFrequencyFilter,
  userFilter,
  setUserFilter,
  uniqueUsers,
  uniqueFrequencies
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Task Filters</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Status Filter */}
        {/* <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select> */}

        {/* Frequency Filter */}
        <select
          value={frequencyFilter}
          onChange={(e) => setFrequencyFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Frequencies</option>
          {uniqueFrequencies.map(freq => (
            <option key={freq} value={freq}>{freq}</option>
          ))}
        </select>

        {/* User Filter */}
        {/* <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Users</option>
          {uniqueUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select> */}
      </div>

      {/* Task Filter Summary */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <span className="text-sm text-gray-600">Active filters:</span>
        {userFilter !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            User: {uniqueUsers.find(u => u.id === userFilter)?.name || 
                   uniqueUsers.find(u => u.id === userFilter)?.email || 'Unknown'}
            <button
              onClick={() => setUserFilter('all')}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}
        {statusFilter !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
            Status: {statusFilter.replace('_', ' ')}
            <button
              onClick={() => setStatusFilter('all')}
              className="ml-1 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}
        {frequencyFilter !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
            Frequency: {frequencyFilter}
            <button
              onClick={() => setFrequencyFilter('all')}
              className="ml-1 text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </span>
        )}
        {searchTerm && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
            Search: "{searchTerm}"
            <button
              onClick={() => setSearchTerm('')}
              className="ml-1 text-yellow-600 hover:text-yellow-800"
            >
              ×
            </button>
          </span>
        )}
        {(userFilter !== 'all' || statusFilter !== 'all' || frequencyFilter !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              setUserFilter('all');
              setStatusFilter('all');
              setFrequencyFilter('all');
              setSearchTerm('');
            }}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}