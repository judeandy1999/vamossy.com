'use client';

import { Users, ShieldCheck, Briefcase, User } from 'lucide-react';

export default function UserStatsCards({ stats }) {
  const statsConfig = [
    {
      label: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Admins',
      value: stats.admin,
      icon: ShieldCheck,
      color: 'text-red-500'
    },
    {
      label: 'Workers',
      value: stats.worker,
      icon: Briefcase,
      color: 'text-blue-500'
    },
    {
      label: 'Regular Users',
      value: stats.user,
      icon: User,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Icon className={`h-8 w-8 ${stat.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
