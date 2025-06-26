'use client';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function TaskSortControls({ sortBy, sortOrder, onSort }) {
  const getSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUpDown className="h-3 w-3" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const sortOptions = [
    { key: 'created_at', label: 'Created' },
    { key: 'completed_at', label: 'Completed' },
    { key: 'title', label: 'Title' },
    { key: 'frequency', label: 'Frequency' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      {sortOptions.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onSort(key)}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {label} {getSortIcon(key)}
        </button>
      ))}
    </div>
  );
}