'use client';

import { ExternalLink, Search, Share2, Globe } from 'lucide-react';

const getSourceIcon = (source, medium) => {
  const lowerSource = source.toLowerCase();
  const lowerMedium = medium.toLowerCase();
  
  if (source === '(direct)' || lowerMedium === '(none)') {
    return Globe;
  }
  if (lowerSource.includes('google') || lowerMedium === 'organic') {
    return Search;
  }
  if (lowerMedium === 'social' || lowerSource.includes('facebook') || lowerSource.includes('twitter') || lowerSource.includes('linkedin')) {
    return Share2;
  }
  return ExternalLink;
};

const getSourceColor = (source, medium) => {
  const lowerSource = source.toLowerCase();
  const lowerMedium = medium.toLowerCase();
  
  if (source === '(direct)') return 'text-blue-600 bg-blue-100';
  if (lowerSource.includes('google')) return 'text-red-600 bg-red-100';
  if (lowerMedium === 'social') return 'text-purple-600 bg-purple-100';
  if (lowerMedium === 'email') return 'text-green-600 bg-green-100';
  return 'text-gray-600 bg-gray-100';
};

const formatSourceName = (source, medium) => {
  if (source === '(direct)') return 'Direct Traffic';
  if (source === '(not set)') return 'Unknown Source';
  return source;
};

export default function TrafficSources({ data }) {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Traffic Sources</h3>
          </div>
        </div>
        <div className="p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
  
  // Sort by users
  const sortedData = [...data].sort((a, b) => b.users - a.users);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Traffic Sources</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">Where your visitors are coming from</p>
      </div>
      
      <div className="p-6">
        {sortedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ExternalLink className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No traffic source data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedData.slice(0, 9).map((source, index) => {
              const Icon = getSourceIcon(source.source, source.medium);
              const percentage = totalUsers > 0 ? (source.users / totalUsers) * 100 : 0;
              const colorClasses = getSourceColor(source.source, source.medium);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {formatSourceName(source.source, source.medium)}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {source.medium === '(not set)' ? 'Unknown medium' : source.medium}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Users</span>
                          <span className="text-sm font-medium text-gray-900">
                            {source.users.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-600">Sessions</span>
                          <span className="text-xs text-gray-900">
                            {source.sessions.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
