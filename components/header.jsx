'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import { navItems } from '@/data/data';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  const pathname = usePathname();

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
        isScrolled ? 'bg-black shadow-md' : 'bg-transparent'
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
          {navItems.map((item) => (
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
        </ul>
      </nav>
    </header>
  )
}
