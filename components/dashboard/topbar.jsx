'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/utils/authService'
import { useAuth } from '@/contexts/auth-context'
import { User } from 'lucide-react'
import Image from 'next/image'

const getPageTitle = (pathname) => {
  if (pathname === '/user-dashboard') return 'Dashboard'
  if (pathname === '/user-dashboard/create-article') return 'Create Article'
  if (pathname === '/user-dashboard/documents') return 'Documents'
  if (pathname === '/user-dashboard/user-management') return 'Role Management'
  if (pathname === '/user-dashboard/analytics') return 'Analytics'
  if (pathname === '/user-dashboard/options') return 'Wiki & Tab Management'
  if (pathname === '/user-dashboard/account-settings') return 'Account Settings'
  if (pathname === '/dashboard/billing') return 'Billing'
  if (pathname === '/dashboard/messages') return 'Messages'
  if (pathname === '/dashboard/settings') return 'Settings'
  return 'Dashboard'
}

export default function Topbar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const dropdownRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()
  
  const { session, status } = useAuth()
  const currentUser = session?.user || null

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const shouldSignOut = sessionStorage.getItem('pendingSignOut')
    if (shouldSignOut === 'true') {
      console.log('[TOPBAR] Detected pending sign out after reload')
      sessionStorage.removeItem('pendingSignOut')
      performSignOut()
    }
  }, [])

  const performSignOut = async () => {
    console.log('[TOPBAR] Performing sign out after reload')
    setIsSigningOut(true)
    
    try {
      const { error } = await signOut()
      console.log('[TOPBAR] Sign out result:', { success: !error, error: error?.message })
      
      if (!error) {
        console.log('[TOPBAR] Sign out successful, redirecting to login')
        window.location.href = '/login'
      } else {
        console.error('[TOPBAR] Sign out failed:', error)
        // Even if signOut fails, redirect anyway
        window.location.href = '/login'
      }
    } catch (err) {
      console.error('[TOPBAR] Sign out exception:', err)
      // Force redirect even on exception
      window.location.href = '/login'
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleSignOut = async () => {
    if (isSigningOut) return

    console.log('[TOPBAR] Sign out clicked - setting up reload and sign out')
    setIsSigningOut(true)
    setShowDropdown(false)
    
    // Set flag in sessionStorage to indicate we want to sign out after reload
    sessionStorage.setItem('pendingSignOut', 'true')
    
    // Reload the page to refresh Supabase connection
    console.log('[TOPBAR] Reloading page to refresh connection...')
    window.location.reload()
  }

  const handleAccountSettings = () => {
    setShowDropdown(false)
    router.push('/user-dashboard/account-settings')
  }

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev)
  }

  const getDisplayName = () => {
    if (!currentUser) return 'U'
    
    if (currentUser.user_metadata?.full_name) {
      return currentUser.user_metadata.full_name
    }
    
    if (currentUser.user_metadata?.name) {
      return currentUser.user_metadata.name
    }
    
    if (currentUser.email) {
      return currentUser.email.split('@')[0]
    }
    
    return 'User'
  }

  const getInitials = () => {
    const displayName = getDisplayName()
    return displayName.charAt(0).toUpperCase()
  }

  const getAvatarUrl = () => {
    if (!currentUser) return null
    
    if (currentUser.user_metadata?.avatar_url) {
      return currentUser.user_metadata.avatar_url
    }
    
    if (currentUser.user_metadata?.picture) {
      return currentUser.user_metadata.picture
    }
    
    return null
  }

  const avatarUrl = getAvatarUrl()

  // Show loading state only during initial auth load or when signing out
  if (status === 'loading' || isSigningOut) {
    return (
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="text-xl font-semibold text-slate-800">{getPageTitle(pathname)}</div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="text-xl font-semibold text-slate-800">{getPageTitle(pathname)}</div>
      <div className="flex items-center gap-4">
        
        {/* Profile with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm hover:bg-gray-400 transition-colors overflow-hidden border-2 border-gray-200 hover:border-gray-300"
            type="button"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
            ) : (
              <span className="font-medium text-slate-700">{getInitials()}</span>
            )}
            {avatarUrl && (
              <span className="font-medium text-slate-700 hidden">{getInitials()}</span>
            )}
          </button>
          
          {/* Dropdown menu */}
          {showDropdown && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200"
              style={{ zIndex: 9999 }}
            >
              <div className="py-2">
                {/* User info header */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm overflow-hidden">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-medium text-slate-700">{getInitials()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAccountSettings}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  type="button"
                >
                  <User size={16} />
                  Account Settings
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors block disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  {isSigningOut ? 'Signing out...' : 'Log out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}