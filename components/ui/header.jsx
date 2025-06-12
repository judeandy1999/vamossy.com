'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { navItems } from '@/data/data';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { signOut } from '@/utils/authService';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export default function Header() {
  const { status, session, role } = useAuthWithRedirect();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const shouldHideNavItems = ['/create-article', '/options', '/user-dashboard'].includes(pathname);

  const renderLinks = () => (
    <>
      {status !== 'authenticated' && navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`transition-colors duration-300 ${
            pathname === item.href ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
          } ${shouldHideNavItems ? 'hidden' : ''}`}
        >
          {item.name}
        </Link>
      ))}

      {session && role === 'admin' && (
        <>
          <Link href="/user-dashboard" className={`transition-colors duration-300 ${pathname === '/user-dashboard' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}>
            Dashboard
          </Link>
          <Link href="/create-article" className={`transition-colors duration-300 ${pathname === '/create-article' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}>
            Create Article
          </Link>
          <Link href="/options" className={`transition-colors duration-300 ${pathname === '/options' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}>
            Options
          </Link>
        </>
      )}

      {session && role === 'user' && (
        <Link href="/user-dashboard" className={`transition-colors duration-300 ${pathname === '/user-dashboard' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}>
          Dashboard
        </Link>
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
          className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
        >
          Log out
        </button>
      )}
    </>
  );

  return (
    <header
      className={`fixed w-full z-2 transition-all duration-500 ease-in-out transform ${
        pathname !== '/' 
          ? 'bg-black shadow-md translate-y-0 opacity-100' 
          : isVisible
            ? `${isScrolled ? 'bg-[#333] shadow-md' : 'bg-[#333]/90'} translate-y-0 opacity-100`
            : 'bg-transparent -translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:py-6 md:px-8 lg:px-12 text-white">
        <div className="flex items-center space-x-4">
          {/* Social Media Icons with Yellow Background */}
          <div className="flex items-center space-x-2">
            <Link 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-500 transition-colors"
            >
              <FaFacebookF size={20} className="text-white" />
            </Link>
            <Link 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-500 transition-colors"
            >
              <FaLinkedinIn size={20} className="text-white" />
            </Link>
          </div>
          
          {/* Main Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/homepage/logo.png" alt="Logo" width={200} height={50} className="h-12 lg:h-14 w-auto" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-8 font-medium text-lg md:text-[28px]">
          {renderLinks()}
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Mobile Menu">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/70 backdrop-blur-sm text-white fixed top-0 left-0 right-0 py-6 px-6 space-y-4 flex flex-col items-center"
          >
            <motion.button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Mobile Menu"
              className="self-end"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} />
            </motion.button>

            {renderLinks()}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
