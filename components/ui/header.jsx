'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import { navItems } from '@/data/data';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { signOut } from '@/utils/authService';

export default function Header() {
  const { status, session, role } = useAuthWithRedirect();
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        pathname !== '/' ? 'bg-black shadow-md' : isScrolled ? 'bg-black shadow-md' : '!bg-transparent'
      }`}
    >
      <nav className="mx-auto flex items-center justify-between px-24 py-8 text-white">
        <Link href="/" className="text-xl font-bold flex items-center">
          {/* <img src="/logo.png" alt="Logo" className="h-6 w-auto mr-2" /> */}
          <span className="text-4xl text-white">
            Brand<span className="text-yellow-400">Name</span>
          </span>
        </Link>

        <ul className="flex space-x-8 font-medium">
          {(isClient && !(pathname === '/create-article' || pathname === '/options' || pathname === '/user-dashboard')) && navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-3xl
                  ${pathname === item.href ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}
                  `
                }>
                {item.name}
              </Link>
            ))}

          {(session && role === 'admin') && (
            <>
              <Link
                key={'dashboard'}
                href='/user-dashboard'
                className={`text-3xl
                  ${pathname === '/user-dashboard' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}
                  `
                }>
                Dashboard
              </Link>
              <Link
                key={'create-article'}
                href='/create-article'
                className={`text-3xl
                  ${pathname === '/create-article' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}
                  `
                }>
                Create Article
              </Link>
              <Link
                key={'options'}
                href='/options'
                className={`text-3xl
                  ${pathname === '/options' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}
                  `
                }>
                Options
              </Link>
            </>
          )}

          {session && (
            <button
              onClick={async () => {
                const { error } = await signOut();
                if (error) {
                  console.error('Error signing out:', error.message);
                } else {
                  window.location.href = '/login';
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Log out
            </button>
          )}
        </ul>
      </nav>
    </header>
  )
}
