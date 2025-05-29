'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  const pathname = usePathname(); // Correctly use `usePathname` for the current route
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Our Work', href: '/our-work' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Wiki', href: '/blog' },
  ];

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
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-2 py-8 text-white">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center">
          {/* <img src="/logo.png" alt="Logo" className="h-6 w-auto mr-2" /> */}
          <span className="text-4xl text-white">
            Brand<span className="text-yellow-400">Name</span>
          </span>
        </Link>

        {/* Navigation Links */}
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
