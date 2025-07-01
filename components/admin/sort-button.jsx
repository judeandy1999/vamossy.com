'use client';

import { ArrowUpDown, SortAsc, Clock } from 'lucide-react';

export default function SortButton({ sortOrder, onSort }) {
  const getSortConfig = () => {
    switch (sortOrder) {
      case 'alphabetical':
        return {
          label: 'A-Z',
          icon: <SortAsc className="h-3 w-3" />,
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'creation':
        return {
          label: 'Date',
          icon: <Clock className="h-3 w-3" />,
          color: 'text-green-600 bg-green-50 border-green-200'
        };
      default:
        return {
          label: 'Sort',
          icon: <ArrowUpDown className="h-3 w-3" />,
          color: 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100'
        };
    }
  };

  const config = getSortConfig();

  return (
    <button
      onClick={onSort}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-md transition-all duration-200 ${config.color}`}
      title={`Sort by ${sortOrder === 'alphabetical' ? 'Name (A-Z)' : sortOrder === 'creation' ? 'Creation Date' : 'Default'}`}
    >
      {config.icon}
      <span className="hidden sm:inline">{config.label}</span>
    </button>
  );
}
