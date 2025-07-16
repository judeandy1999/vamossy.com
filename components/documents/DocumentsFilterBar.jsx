import React from 'react';
import { Search } from 'lucide-react';

export default function DocumentsFilterBar({ search, sortOrder, handleSearch, handleSortChange }) {
  return (
    <div className="bg-white/90 rounded-xl shadow-lg mb-10 border border-gray-100">
      <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-gray-700 transition-all duration-150"
          />
        </div>
        <div className="w-full md:w-60 flex items-center">
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 text-gray-700 font-medium appearance-none transition-all duration-150 cursor-pointer"
            style={{ minWidth: 160 }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-az">Filename A-Z</option>
            <option value="name-za">Filename Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
