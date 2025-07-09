'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { supabase } from '@/utils/client';

// Client-side cache for analytics data
const analyticsCache = new Map();
const CACHE_DURATION = 30 * 1000; // 30 seconds for client-side cache

export const useAnalyticsData = (dateRange = '7daysAgo') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cached, setCached] = useState(false);
  const { status } = useAuthWithRedirect();
  const abortControllerRef = useRef(null);

  const getCacheKey = (range) => `analytics-${range}`;

  const getCachedData = useCallback((range) => {
    const cacheKey = getCacheKey(range);
    const cached = analyticsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    
    // Clean up expired cache entries
    if (cached && Date.now() - cached.timestamp >= CACHE_DURATION) {
      analyticsCache.delete(cacheKey);
    }
    
    return null;
  }, []);

  const setCachedData = useCallback((range, data) => {
    const cacheKey = getCacheKey(range);
    analyticsCache.set(cacheKey, {
      data: data.data,
      lastUpdated: data.lastUpdated,
      timestamp: Date.now()
    });
  }, []);

  const fetchAnalyticsData = useCallback(async (showLoading = true, useCache = true) => {
    // Only fetch if user is authenticated
    if (status !== 'authenticated') {
      if (showLoading) setLoading(false);
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first (stale-while-revalidate pattern)
    if (useCache) {
      const cachedResult = getCachedData(dateRange);
      if (cachedResult) {
        setData(cachedResult.data);
        setLastUpdated(cachedResult.lastUpdated);
        setCached(true);
        if (showLoading) setLoading(false);
        
        // Continue to fetch fresh data in background
        if (!showLoading) {
          // Background refresh
          fetchAnalyticsData(false, false);
        }
        return;
      }
    }

    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      // Get the current session to include auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/analytics/dashboard?dateRange=${dateRange}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(result.lastUpdated);
        setCached(result.cached || false);
        
        // Cache the result
        setCachedData(dateRange, result);
        
        if (showLoading) setLoading(false);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }
      
      console.error('Analytics fetch error:', err);
      setError(err.message);
      if (showLoading) setLoading(false);
    }
  }, [status, dateRange, getCachedData, setCachedData]);

  const refresh = useCallback(() => {
    // Clear cache for this date range and fetch fresh data
    const cacheKey = getCacheKey(dateRange);
    analyticsCache.delete(cacheKey);
    fetchAnalyticsData(true, false);
  }, [dateRange, fetchAnalyticsData]);

  useEffect(() => {
    fetchAnalyticsData();
    
    // Cleanup abort controller on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnalyticsData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    cached,
    refresh
  };
};