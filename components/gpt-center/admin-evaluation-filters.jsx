'use client';

import { Search, Filter } from 'lucide-react';

export default function AdminEvaluationFilters({
  searchTerm,
  setSearchTerm,
  userEvaluationFilter,
  setUserEvaluationFilter,
  evaluationFilter,
  setEvaluationFilter,
  scoreFilter,
  setScoreFilter,
  uniqueEvaluationUsers
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Evaluation Filters</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, users, feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* User Filter */}
        <select
          value={userEvaluationFilter}
          onChange={(e) => setUserEvaluationFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Users</option>
          {uniqueEvaluationUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <select
          value={evaluationFilter}
          onChange={(e) => setEvaluationFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Time</option>
          <option value="daily">Today</option>
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">Last 30 Days</option>
        </select>

        {/* Score Filter */}
        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Scores</option>
          <option value="90-100">Excellent (90-100)</option>
          <option value="80-89">Good (80-89)</option>
          <option value="70-79">Average (70-79)</option>
          <option value="60-69">Below Average (60-69)</option>
          <option value="0-59">Poor (0-59)</option>
        </select>
      </div>

      {/* Filter Summary */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <span className="text-sm text-gray-600">Active filters:</span>
        {userEvaluationFilter !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            User: {uniqueEvaluationUsers.find(u => u.id === userEvaluationFilter)?.name || 
                   uniqueEvaluationUsers.find(u => u.id === userEvaluationFilter)?.email || 'Unknown'}
            <button
              onClick={() => setUserEvaluationFilter('all')}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}
        {evaluationFilter !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
            Time: {evaluationFilter}
            <button
              onClick={() => setEvaluationFilter('all')}
              className="ml-1 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}
        {scoreFilter !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
            Score: {scoreFilter}
            <button
              onClick={() => setScoreFilter('all')}
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
        {(userEvaluationFilter !== 'all' || evaluationFilter !== 'all' || scoreFilter !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              setUserEvaluationFilter('all');
              setEvaluationFilter('all');
              setScoreFilter('all');
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