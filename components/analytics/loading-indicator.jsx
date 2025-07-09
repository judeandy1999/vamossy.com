'use client';

import { RefreshCw } from 'lucide-react';

export default function LoadingIndicator({ loading, lastUpdated, cached, onRefresh }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1">
      {loading && (
        <div className="flex items-center">
          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
          <span>Loading...</span>
        </div>
      )}
      
      {!loading && (
        <div className="flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
            cached ? 'bg-yellow-400' : 'bg-green-400'
          }`} />
          <span>
            {cached ? 'Cached' : 'Fresh'} • Updated: {formatTime(lastUpdated)}
          </span>
        </div>
      )}
      
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-2 p-1 rounded transition-colors"
          title="Refresh data"
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
