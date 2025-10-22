// components/dashboard/sidebar.jsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect'
import { 
  Home, 
  PenTool, 
  Settings, 
  CreditCard, 
  FolderOpen, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Layers,
  Calendar,
  Receipt,
  UserCheck,
  TrendingUp,
  Cog,
  Wallet
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/user-dashboard', icon: Home, roles: ['admin', 'user', 'worker'] },
  { label: 'Documents', href: '/user-dashboard/documents', icon: FolderOpen, roles: ['user','worker', 'admin'] },
  { label: 'Create Article', href: '/user-dashboard/create-article', icon: PenTool, roles: ['admin', 'worker'] },
  { label: 'Role Management', href: '/user-dashboard/user-management', icon: UserCheck, roles: ['admin'] },
  { label: 'Cards Management', href: '/user-dashboard/card-management', icon: Layers, roles: ['admin', 'worker', 'user'] },
  //{ label: 'Analytics', href: '/user-dashboard/analytics', icon: TrendingUp, roles: ['admin'] },
  { label: 'Options', href: '/user-dashboard/options', icon: Cog, roles: ['admin'] },
  { label: 'Booking & Payments', href: '/user-dashboard/booking', icon: Calendar, roles: [] },
  { label: 'Transactions', href: '/user-dashboard/transactions', icon: Receipt, roles: [] },
  //{ label: 'Asset Library', href: '/dashboard/assets', icon: FolderOpen, roles: ['admin', 'user'] },
  //{ label: 'FAQ', href: '/dashboard/faq', icon: HelpCircle, roles: ['admin', 'user', 'worker'] },
]

export default function Sidebar() {
  const { role, status } = useAuthWithRedirect()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleNavClick = (href) => {
    // Force reload when navigating
    window.location.href = href
  }

  const filteredNavItems = role ? navItems.filter(item => item.roles.includes(role)) : []

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm transition-all duration-300 ease-in-out`}>
      {/* Header with logo and toggle */}
      <div className="p-2 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          // <Link href="/" className="flex items-center">
            <div className='flex flex-col items-center'>
              <span className="p-1 font-semibold text-3xl bg-gradient-to-r from-[#032646] to-[#60a5fa] bg-clip-text text-transparent">
                Vamossy
              </span>
              <span className="text-[#032646] text-sm font-medium -mt-4">
                vamossy.com
              </span>
            </div>
          // </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-slate-600" />
          ) : (
            <ChevronLeft size={18} className="text-slate-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {status === 'loading' ? (
          <div className="space-y-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                {!isCollapsed && (
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          filteredNavItems.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavClick(href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative cursor-pointer ${
                pathname === href
                  ? 'bg-yellow-500 text-white font-medium shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-800'
              }`}
              title={isCollapsed ? label : ''}
            >
              <Icon 
                size={20} 
                className={`flex-shrink-0 ${
                  pathname === href ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                }`} 
              />
              {!isCollapsed && (
                <span className="truncate text-left">{label}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-gray-300 text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </button>
          ))
        )}
      </nav>

      {/* Footer info when expanded */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-slate-500 text-center">
            Vamossy Dashboard
          </div>
        </div>
      )}
    </aside>
  )
}