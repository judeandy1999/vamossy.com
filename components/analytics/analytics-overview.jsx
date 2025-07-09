'use client';

import { Users, Eye, Clock, TrendingUp, MousePointer, UserPlus, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, isRealtime = false }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 mb-1">
            {isRealtime && (
              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold mr-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
            )}
            {title}
          </p>
          <p className="text-base font-bold text-gray-900">{value.toLocaleString()}</p>
          {change !== undefined && (
            <p className={`text-xs mt-0.5 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`p-1.5 rounded-lg ${isRealtime ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Icon className={`w-4 h-4 ${isRealtime ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsOverview({ data }) {
  const { realtime, overview } = data || {};

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-2 rounded-lg shadow animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const engagementRate = overview.totalSessions > 0 
    ? ((overview.engagedSessions / overview.totalSessions) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 mb-2">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Real-time Active Users */}
        <StatCard
          title="Active Users"
          value={realtime.activeUsers}
          icon={Activity}
          isRealtime={true}
        />

        {/* Total Users */}
        <StatCard
          title="Total Users"
          value={overview.totalUsers}
          icon={Users}
        />

        {/* Sessions */}
        <StatCard
          title="Sessions"
          value={overview.totalSessions}
          icon={MousePointer}
        />

        {/* Page Views */}
        <StatCard
          title="Page Views"
          value={overview.totalPageViews}
          icon={Eye}
        />

        {/* New Users */}
        <StatCard
          title="New Users"
          value={overview.newUsers}
          icon={UserPlus}
        />

        {/* Average Session Duration */}
        <StatCard
          title="Avg. Session Duration"
          value={formatDuration(overview.avgSessionDuration)}
          icon={Clock}
        />

        {/* Bounce Rate */}
        <StatCard
          title="Bounce Rate"
          value={`${overview.bounceRate}%`}
          icon={TrendingUp}
        />

        {/* Engagement Rate */}
        <StatCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
