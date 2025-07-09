'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { redirect } from 'next/navigation';
import Spinner from '@/components/ui/spinner';
import AnalyticsOverview from '@/components/analytics/analytics-overview';
import AnalyticsCharts from '@/components/analytics/analytics-charts';
import TopPagesTable from '@/components/analytics/top-pages-table';
import UserDemographics from '@/components/analytics/user-demographics';
import DeviceAnalytics from '@/components/analytics/device-analytics';
import TrafficSources from '@/components/analytics/traffic-sources';
import DateRangeSelector from '@/components/analytics/date-range-selector';
import LoadingIndicator from '@/components/analytics/loading-indicator';
import { useState, Suspense, useEffect } from 'react';
import { useAnalyticsData } from '@/hooks/useAnalytics';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Skeleton components for better perceived performance
const AnalyticsCardSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
    <div className="animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-1"></div>
      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const TableSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-3 mb-2">
          <div className="h-3 bg-gray-200 rounded flex-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

const ChartSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

function AnalyticsDashboard() {
  const { status, session } = useAuthWithRedirect();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get date range from URL params or default to '7daysAgo'
  const [dateRange, setDateRange] = useState(() => {
    return searchParams.get('dateRange') || '7daysAgo';
  });
  
  const { data: analyticsData, loading, error, lastUpdated, cached, refresh } = useAnalyticsData(dateRange);

  // Update URL when date range changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (dateRange !== '7daysAgo') {
      params.set('dateRange', dateRange);
    } else {
      params.delete('dateRange');
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [dateRange, searchParams, router, pathname]);

  // Sync state with URL params when they change (e.g., browser back/forward)
  useEffect(() => {
    const urlDateRange = searchParams.get('dateRange') || '7daysAgo';
    if (urlDateRange !== dateRange) {
      setDateRange(urlDateRange);
    }
  }, [searchParams]);

  // Show data immediately if available, even while loading fresh data
  const hasData = analyticsData && Object.keys(analyticsData).length > 0;
  const showSkeletons = loading && !hasData;

  if (status === 'loading') {
    return <Spinner />;
  }

  if (!session) {
    redirect('/login');
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">GA4</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading analytics data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 px-6 space-y-2 pb-6 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">GA4</h1>
          <LoadingIndicator 
            loading={loading} 
            lastUpdated={lastUpdated} 
            cached={cached} 
            onRefresh={refresh}
          />
        </div>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>
      
      {/* Overview Cards - Load first */}
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => <AnalyticsCardSkeleton key={i} />)}
      </div>}>
        {showSkeletons ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => <AnalyticsCardSkeleton key={i} />)}
          </div>
        ) : (
          <AnalyticsOverview data={analyticsData} />
        )}
      </Suspense>
      
      {/* Device Analytics and Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Suspense fallback={<AnalyticsCardSkeleton className="h-48" />}>
          {showSkeletons ? (
            <AnalyticsCardSkeleton className="h-48" />
          ) : (
            <DeviceAnalytics data={analyticsData?.devices} dateRange={dateRange} />
          )}
        </Suspense>
        <Suspense fallback={<AnalyticsCardSkeleton className="h-48" />}>
          {showSkeletons ? (
            <AnalyticsCardSkeleton className="h-48" />
          ) : (
            <UserDemographics data={analyticsData?.demographics} dateRange={dateRange} />
          )}
        </Suspense>
      </div>
      
      {/* Tables and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="space-y-2">
          {/* Traffic Sources - Above Top Pages */}
          <Suspense fallback={<AnalyticsCardSkeleton className="h-48" />}>
            {showSkeletons ? (
              <AnalyticsCardSkeleton className="h-48" />
            ) : (
              <TrafficSources data={analyticsData?.trafficSources} dateRange={dateRange} />
            )}
          </Suspense>
          
          <Suspense fallback={<TableSkeleton className="h-96" />}>
            {showSkeletons ? (
              <TableSkeleton className="h-96" />
            ) : (
              <TopPagesTable data={analyticsData?.topPages} dateRange={dateRange} />
            )}
          </Suspense>
        </div>
        
        <Suspense fallback={<ChartSkeleton className="h-full" />}>
          {showSkeletons ? (
            <ChartSkeleton className="h-full" />
          ) : (
            <AnalyticsCharts data={analyticsData} dateRange={dateRange} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function AnalyticsDashboardPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}
