'use client';

import { MapPin, Globe } from 'lucide-react';

export default function UserDemographics({ data }) {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);

  // Group by country and sum users
  const countryData = data.reduce((acc, item) => {
    const existing = acc.find(c => c.country === item.country);
    if (existing) {
      existing.users += item.users;
      existing.cities.push({ city: item.city, users: item.users });
    } else {
      acc.push({
        country: item.country,
        users: item.users,
        cities: [{ city: item.city, users: item.users }]
      });
    }
    return acc;
  }, []);

  // Sort by users
  countryData.sort((a, b) => b.users - a.users);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">User Demographics</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">Geographic distribution of your users</p>
      </div>
      
      <div className="p-6">
        {countryData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No location data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {countryData.slice(0, 8).map((country, index) => {
              const percentage = totalUsers > 0 ? (country.users / totalUsers) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {country.country}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {country.users.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
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
