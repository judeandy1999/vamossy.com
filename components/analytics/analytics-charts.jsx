'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

export default function AnalyticsCharts({ data }) {
  const [activeChart, setActiveChart] = useState('sessions');
  
  const { overview, devices, trafficSources } = data || {};

  if (!data || !overview) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Format daily data for charts - Fix invalid dates with exact dates
  const chartData = overview.dailyData?.map((day, index) => {
    // Handle different date formats that might come from the API
    let date;
    
    if (typeof day.date === 'string') {
      // Try parsing as ISO string first
      date = new Date(day.date);
      
      if (isNaN(date.getTime())) {
        // Try parsing as YYYY-MM-DD format
        const dateParts = day.date.split('-');
        if (dateParts.length === 3) {
          date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        } else {
          // Try parsing as YYYYMMDD format
          if (day.date.length === 8) {
            const year = parseInt(day.date.substring(0, 4));
            const month = parseInt(day.date.substring(4, 6)) - 1;
            const dayNum = parseInt(day.date.substring(6, 8));
            date = new Date(year, month, dayNum);
          } else {
            // Create date based on index from today going backwards
            date = new Date();
            date.setDate(date.getDate() - (overview.dailyData.length - 1 - index));
          }
        }
      }
    } else if (day.date instanceof Date) {
      date = day.date;
    } else {
      // Create date based on index from today going backwards
      date = new Date();
      date.setDate(date.getDate() - (overview.dailyData.length - 1 - index));
    }
    
    const isValidDate = !isNaN(date.getTime());
    
    return {
      date: isValidDate ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `${new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      sessions: day.sessions || 0,
      pageViews: day.pageViews || 0,
      users: day.users || 0,
    };
  }) || [];

  // Format device data for pie chart - Add safety checks
  const deviceChartData = devices?.reduce((acc, device) => {
    if (!device?.deviceCategory || !device?.users) return acc;
    
    const existingDevice = acc.find(d => d.name === device.deviceCategory);
    if (existingDevice) {
      existingDevice.value += device.users;
    } else {
      acc.push({ name: device.deviceCategory, value: device.users });
    }
    return acc;
  }, []) || [];

  // Format traffic sources for pie chart - Add safety checks
  const trafficChartData = trafficSources?.slice(0, 6).map(source => ({
    name: source?.source === '(direct)' ? 'Direct' : (source?.source || 'Unknown'),
    value: source?.users || 0,
  })).filter(item => item.value > 0) || [];

  const chartOptions = [
    { id: 'sessions', label: 'Sessions', color: '#3b82f6' },
    { id: 'pageViews', label: 'Page Views', color: '#10b981' },
    { id: 'users', label: 'Users', color: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 h-full px-2">
      {/* Top Row */}
      {/* Analytics Trends Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col">
        <div className="flex flex-wrap items-center justify-between mb-2 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-900">Analytics Trends</h3>
          <div className="flex gap-1">
            {chartOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveChart(option.id)}
                className={`px-1 py-0.5 text-xs rounded transition-colors ${
                  activeChart === option.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={10}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey={activeChart}
                stroke={chartOptions.find(opt => opt.id === activeChart)?.color}
                strokeWidth={2}
                dot={{ fill: chartOptions.find(opt => opt.id === activeChart)?.color, strokeWidth: 1, r: 2 }}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Categories Pie Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 mb-2 flex-shrink-0">Device Categories</h3>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={40}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      {/* Traffic Sources Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 mb-2 flex-shrink-0">Traffic Sources</h3>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                type="number"
                stroke="#6b7280"
                fontSize={10}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="#6b7280"
                fontSize={10}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#3b82f6"
                radius={[0, 2, 2, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sessions vs Page Views Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 mb-2 flex-shrink-0">Sessions vs Page Views</h3>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={10}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" radius={[1, 1, 0, 0]} />
              <Bar dataKey="pageViews" fill="#10b981" name="Page Views" radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
