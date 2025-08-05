import GoogleAnalyticsService from '@/lib/googleAnalytics';

const cache = new Map();
const CACHE_DURATION = 45 * 1000; // 45 seconds for ultra-fast response
const MAX_CACHE_SIZE = 50; // Prevent memory leaks

const getCacheKey = (dateRange) => `analytics-${dateRange}`;

const getCachedData = (dateRange) => {
  const cacheKey = getCacheKey(dateRange);
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  // Clean up expired cache entries
  if (cached && Date.now() - cached.timestamp >= CACHE_DURATION) {
    cache.delete(cacheKey);
  }
  
  return null;
};

const setCachedData = (dateRange, data) => {
  const cacheKey = getCacheKey(dateRange);
  
  // If cache is getting too large, remove oldest entries
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dateRange = '7daysAgo' } = req.query;
    const cachedResult = getCachedData(dateRange);
    if (cachedResult) {
      return res.status(200).json({
        success: true,
        data: cachedResult.data,
        dateRange,
        lastUpdated: cachedResult.lastUpdated,
        cached: true
      });
    }

    // Fetch analytics data
    const analyticsData = await GoogleAnalyticsService.getUserBehaviorReports(dateRange);

    const result = {
      data: analyticsData,
      lastUpdated: new Date().toISOString()
    };

    // Cache the result
    setCachedData(dateRange, result);

    return res.status(200).json({
      success: true,
      data: analyticsData,
      dateRange,
      lastUpdated: result.lastUpdated,
      cached: false
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
