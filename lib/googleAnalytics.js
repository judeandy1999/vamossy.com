import { google } from 'googleapis';

class GoogleAnalyticsService {
  constructor() {
    this.propertyId = process.env.GA4_PROPERTY_ID;
    this.auth = null;
    this.analyticsAdmin = null;
    this.analyticsData = null;
  }

  async initialize() {
    if (this.auth) {
      return; // Already initialized
    }

    try {
      // Check required environment variables
      if (!this.propertyId) {
        throw new Error('GA4_PROPERTY_ID environment variable is required');
      }
      if (!process.env.GA4_SERVICE_ACCOUNT_EMAIL) {
        throw new Error('GA4_SERVICE_ACCOUNT_EMAIL environment variable is required');
      }
      if (!process.env.GA4_PRIVATE_KEY) {
        throw new Error('GA4_PRIVATE_KEY environment variable is required');
      }
      if (!process.env.GA4_PROJECT_ID) {
        throw new Error('GA4_PROJECT_ID environment variable is required');
      }
      if (!process.env.GA4_PRIVATE_KEY_ID) {
        throw new Error('GA4_PRIVATE_KEY_ID environment variable is required');
      }
      if (!process.env.GA4_CLIENT_ID) {
        throw new Error('GA4_CLIENT_ID environment variable is required');
      }

      // Create JWT auth
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          type: process.env.GA4_TYPE || 'service_account',
          project_id: process.env.GA4_PROJECT_ID,
          private_key_id: process.env.GA4_PRIVATE_KEY_ID,
          private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
          client_id: process.env.GA4_CLIENT_ID,
          auth_uri: process.env.GA4_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
          token_uri: process.env.GA4_TOKEN_URI || 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: process.env.GA4_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: process.env.GA4_CLIENT_X509_CERT_URL || `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GA4_SERVICE_ACCOUNT_EMAIL)}`,
          universe_domain: process.env.GA4_UNIVERSE_DOMAIN || 'googleapis.com'
        },
        scopes: process.env.GA4_SCOPES ? process.env.GA4_SCOPES.split(',') : [
          'https://www.googleapis.com/auth/analytics.readonly',
          'https://www.googleapis.com/auth/analytics',
        ],
      });

      // Initialize Analytics Data and Admin APIs
      this.analyticsData = google.analyticsdata({
        version: 'v1beta',
        auth: this.auth,
      });

      this.analyticsAdmin = google.analyticsadmin({
        version: 'v1beta',
        auth: this.auth,
      });

    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
      throw error;
    }
  }

  async getUserBehaviorReports(dateRange = '7daysAgo') {
    try {
      await this.initialize();

      const property = `properties/${this.propertyId}`;
      
      // Execute all API calls in parallel for better performance
      const [
        realtimeData,
        sessionData,
        topPagesData,
        demographicsData,
        deviceData,
        trafficSourceData
      ] = await Promise.all([
        // Real-time users
        this.analyticsData.properties.runRealtimeReport({
          property,
          requestBody: {
            metrics: [
              { name: 'activeUsers' },
              { name: 'screenPageViews' }
            ],
          },
        }),
        
        // Sessions and page views
        this.analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: dateRange, endDate: 'today' }],
            metrics: [
              { name: 'sessions' },
              { name: 'screenPageViews' },
              { name: 'averageSessionDuration' },
              { name: 'bounceRate' },
              { name: 'engagedSessions' },
              { name: 'totalUsers' },
              { name: 'newUsers' },
            ],
            dimensions: [
              { name: 'date' }
            ],
          },
        }),
        
        // Top pages
        this.analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: dateRange, endDate: 'today' }],
            metrics: [
              { name: 'screenPageViews' },
              { name: 'sessions' },
              { name: 'averageSessionDuration' }
            ],
            dimensions: [
              { name: 'pageTitle' },
              { name: 'pagePath' }
            ],
            orderBys: [
              {
                metric: { metricName: 'screenPageViews' },
                desc: true
              }
            ],
            limit: 10
          },
        }),
        
        // User demographics
        this.analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: dateRange, endDate: 'today' }],
            metrics: [
              { name: 'totalUsers' }
            ],
            dimensions: [
              { name: 'country' },
              { name: 'city' }
            ],
            orderBys: [
              {
                metric: { metricName: 'totalUsers' },
                desc: true
              }
            ],
            limit: 10
          },
        }),
        
        // Device information
        this.analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: dateRange, endDate: 'today' }],
            metrics: [
              { name: 'totalUsers' },
              { name: 'sessions' }
            ],
            dimensions: [
              { name: 'deviceCategory' },
              { name: 'operatingSystem' }
            ],
            orderBys: [
              {
                metric: { metricName: 'totalUsers' },
                desc: true
              }
            ]
          },
        }),
        
        // Traffic sources
        this.analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: dateRange, endDate: 'today' }],
            metrics: [
              { name: 'totalUsers' },
              { name: 'sessions' }
            ],
            dimensions: [
              { name: 'sessionSource' },
              { name: 'sessionMedium' }
            ],
            orderBys: [
              {
                metric: { metricName: 'totalUsers' },
                desc: true
              }
            ],
            limit: 10
          },
        })
      ]);

      return {
        realtime: this.formatRealtimeData(realtimeData.data),
        overview: this.formatOverviewData(sessionData.data),
        topPages: this.formatTopPagesData(topPagesData.data),
        demographics: this.formatDemographicsData(demographicsData.data),
        devices: this.formatDeviceData(deviceData.data),
        trafficSources: this.formatTrafficSourceData(trafficSourceData.data),
      };

    } catch (error) {
      console.error('Error fetching user behavior reports:', error);
      throw error;
    }
  }

  formatRealtimeData(data) {
    if (!data.rows || data.rows.length === 0) {
      return { activeUsers: 0, pageViews: 0 };
    }

    const row = data.rows[0];
    return {
      activeUsers: parseInt(row.metricValues[0]?.value || '0'),
      pageViews: parseInt(row.metricValues[1]?.value || '0'),
    };
  }

  formatOverviewData(data) {
    if (!data.rows || data.rows.length === 0) {
      return {
        totalSessions: 0,
        totalPageViews: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        engagedSessions: 0,
        totalUsers: 0,
        newUsers: 0,
        dailyData: []
      };
    }

    const totals = data.rows.reduce(
      (acc, row) => {
        acc.sessions += parseInt(row.metricValues[0]?.value || '0');
        acc.pageViews += parseInt(row.metricValues[1]?.value || '0');
        acc.avgSessionDuration += parseFloat(row.metricValues[2]?.value || '0');
        acc.bounceRate += parseFloat(row.metricValues[3]?.value || '0');
        acc.engagedSessions += parseInt(row.metricValues[4]?.value || '0');
        acc.totalUsers += parseInt(row.metricValues[5]?.value || '0');
        acc.newUsers += parseInt(row.metricValues[6]?.value || '0');
        return acc;
      },
      { sessions: 0, pageViews: 0, avgSessionDuration: 0, bounceRate: 0, engagedSessions: 0, totalUsers: 0, newUsers: 0 }
    );

    const dailyData = data.rows.map(row => ({
      date: row.dimensionValues[0]?.value,
      sessions: parseInt(row.metricValues[0]?.value || '0'),
      pageViews: parseInt(row.metricValues[1]?.value || '0'),
      users: parseInt(row.metricValues[5]?.value || '0'),
    }));

    return {
      totalSessions: totals.sessions,
      totalPageViews: totals.pageViews,
      avgSessionDuration: Math.round(totals.avgSessionDuration / data.rows.length),
      bounceRate: Math.round((totals.bounceRate / data.rows.length) * 100) / 100,
      engagedSessions: totals.engagedSessions,
      totalUsers: totals.totalUsers,
      newUsers: totals.newUsers,
      dailyData
    };
  }

  formatTopPagesData(data) {
    if (!data.rows || data.rows.length === 0) {
      return [];
    }

    return data.rows.map(row => ({
      title: row.dimensionValues[0]?.value || 'Unknown',
      path: row.dimensionValues[1]?.value || '/',
      pageViews: parseInt(row.metricValues[0]?.value || '0'),
      sessions: parseInt(row.metricValues[1]?.value || '0'),
      avgSessionDuration: parseFloat(row.metricValues[2]?.value || '0'),
    }));
  }

  formatDemographicsData(data) {
    if (!data.rows || data.rows.length === 0) {
      return [];
    }

    return data.rows.map(row => ({
      country: row.dimensionValues[0]?.value || 'Unknown',
      city: row.dimensionValues[1]?.value || 'Unknown',
      users: parseInt(row.metricValues[0]?.value || '0'),
    }));
  }

  formatDeviceData(data) {
    if (!data.rows || data.rows.length === 0) {
      return [];
    }

    return data.rows.map(row => ({
      deviceCategory: row.dimensionValues[0]?.value || 'Unknown',
      operatingSystem: row.dimensionValues[1]?.value || 'Unknown',
      users: parseInt(row.metricValues[0]?.value || '0'),
      sessions: parseInt(row.metricValues[1]?.value || '0'),
    }));
  }

  formatTrafficSourceData(data) {
    if (!data.rows || data.rows.length === 0) {
      return [];
    }

    return data.rows.map(row => ({
      source: row.dimensionValues[0]?.value || 'Unknown',
      medium: row.dimensionValues[1]?.value || 'Unknown',
      users: parseInt(row.metricValues[0]?.value || '0'),
      sessions: parseInt(row.metricValues[1]?.value || '0'),
    }));
  }
}

export default new GoogleAnalyticsService();
