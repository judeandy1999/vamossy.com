'use client';

import { Smartphone, Monitor, Tablet } from 'lucide-react';

const getDeviceIcon = (deviceCategory) => {
  switch (deviceCategory.toLowerCase()) {
    case 'mobile':
      return Smartphone;
    case 'desktop':
      return Monitor;
    case 'tablet':
      return Tablet;
    default:
      return Monitor;
  }
};

export default function DeviceAnalytics({ data }) {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">Device Analytics</h3>
        </div>
        <div className="p-3 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Group by device category
  const deviceData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.deviceCategory === item.deviceCategory);
    if (existing) {
      existing.users += item.users;
      existing.sessions += item.sessions;
    } else {
      acc.push({
        deviceCategory: item.deviceCategory,
        users: item.users,
        sessions: item.sessions
      });
    }
    return acc;
  }, []);

  const totalUsers = deviceData.reduce((sum, item) => sum + item.users, 0);
  deviceData.sort((a, b) => b.users - a.users);

  // Operating systems
  const osData = data.reduce((acc, item) => {
    const existing = acc.find(os => os.operatingSystem === item.operatingSystem);
    if (existing) {
      existing.users += item.users;
    } else {
      acc.push({
        operatingSystem: item.operatingSystem,
        users: item.users
      });
    }
    return acc;
  }, []).sort((a, b) => b.users - a.users);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-medium text-gray-900">Device Analytics</h3>
        </div>
        <p className="text-xs text-gray-600 mt-1">Devices and operating systems used by visitors</p>
      </div>
      
      <div className="p-3 space-y-4">
        {/* Device Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Device Categories</h4>
          <div className="space-y-2">
            {deviceData.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                No device data available
              </div>
            ) : (
              deviceData.map((device, index) => {
                const Icon = getDeviceIcon(device.deviceCategory);
                const percentage = totalUsers > 0 ? (device.users / totalUsers) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {device.deviceCategory}
                        </span>
                        <span className="text-xs text-gray-600">
                          {device.users.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Operating Systems */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Top Operating Systems</h4>
          <div className="space-y-2">
            {osData.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No OS data available
              </div>
            ) : (
              osData.slice(0, 6).map((os, index) => {
                const percentage = totalUsers > 0 ? (os.users / totalUsers) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-900">
                      {os.operatingSystem === '(not set)' ? 'Unknown' : os.operatingSystem}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {os.users.toLocaleString()}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
