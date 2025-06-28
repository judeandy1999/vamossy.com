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
  Bot,
  Zap
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/user-dashboard', icon: Home, roles: ['admin', 'user', 'worker'] },
  // { label: 'GPT Center', href: '/user-dashboard/gpt-center', icon: Bot, roles: ['admin', 'worker'] },
  { label: 'Create Article', href: '/user-dashboard/create-article', icon: PenTool, roles: ['admin'] },
  { label: 'Options', href: '/user-dashboard/options', icon: Settings, roles: ['admin'] },
  { label: 'Billing & Payments', href: '/dashboard/billing', icon: CreditCard, roles: ['user'] },
  { label: 'Asset Library', href: '/dashboard/assets', icon: FolderOpen, roles: ['admin', 'user'] },
  { label: 'FAQ', href: '/dashboard/faq', icon: HelpCircle, roles: ['admin', 'user', 'worker'] },
]

export default function Sidebar() {
  const { role, status } = useAuthWithRedirect()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const filteredNavItems = role ? navItems.filter(item => item.roles.includes(role)) : []

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm transition-all duration-300 ease-in-out`}>
      {/* Header with logo and toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center">
            <Image 
              src="/homepage/logo.png" 
              alt="Logo" 
              width={120} 
              height={30} 
              className="h-8 w-auto" 
            />
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
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
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${
                pathname === href
                  ? 'bg-yellow-500 text-gray-300 font-medium shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-800'
              }`}
              title={isCollapsed ? label : ''}
            >
              <Icon 
                size={20} 
                className={`flex-shrink-0 ${
                  pathname === href ? 'text-gray-300' : 'text-slate-500 group-hover:text-slate-700'
                }`} 
              />
              {!isCollapsed && (
                <span className="truncate">{label}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-gray-300 text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </Link>
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