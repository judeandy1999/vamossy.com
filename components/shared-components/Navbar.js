"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'How it Works', href: '/how-it-works' },
  { name: 'Services', href: '/services' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [aboutMobileDropdownOpen, setAboutMobileDropdownOpen] = useState(false);
  const [resourcesMobileDropdownOpen, setResourcesMobileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const aboutRef = useRef(null);
  const resourcesRef = useRef(null);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setAboutDropdownOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesDropdownOpen(false);
      }
    }
    if (aboutDropdownOpen || resourcesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [aboutDropdownOpen, resourcesDropdownOpen]);

  if (pathname === '/user-dashboard' || pathname.startsWith('/user-dashboard/')) {
    return null;
  }

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className='max-w-7xl px-4 py-6 mx-auto flex items-center justify-between'>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex flex-col items-center transition-colors">
            <span className="p-1 font-semibold text-5xl bg-gradient-to-r from-[#032646] to-[#60a5fa] bg-clip-text text-transparent">
              Vamossy
            </span>
            <span className="text-[#032646] text-lg font-medium -mt-4">
              vamossy.com
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} className="text-[#4b5562] text-xl hover:text-blue-600 transition-colors">
              {link.name}
            </Link>
          ))}
          {/* Resources Dropdown */}
          <div className="relative" ref={resourcesRef}>
            <button
              className={`text-[#4b5562] cursor-pointer text-xl hover:text-blue-600 transition-colors flex items-center py-2 rounded-lg ${resourcesDropdownOpen ? "text-blue-600" : ""}`}
              aria-haspopup="true"
              aria-expanded={resourcesDropdownOpen}
              onClick={() => setResourcesDropdownOpen((open) => !open)}
            >
              Resources
              {/* Simple chevron-down icon (Heroicons style) */}
              <svg className={`w-5 h-5 ml-1 transition-transform ${resourcesDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
              </svg>
            </button>
            <AnimatePresence>
              {resourcesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 mt-3 w-44 bg-white rounded-xl shadow-lg z-30 border border-blue-100 overflow-hidden"
                >
                  <div className="flex flex-col">
                    <Link
                      href="/articles"
                      className="px-5 py-3 text-[#1e283c] hover:bg-blue-50 transition-colors"
                      onClick={() => setResourcesDropdownOpen(false)}
                    >
                      Articles
                    </Link>
                    <Link
                      href="/case-studies"
                      className="px-5 py-3 text-[#1e283c] hover:bg-blue-50 transition-colors"
                      onClick={() => setResourcesDropdownOpen(false)}
                    >
                      Case Studies
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* About Dropdown */}
          <div className="relative" ref={aboutRef}>
            <button
              className={`text-[#4b5562] cursor-pointer text-xl hover:text-blue-600 transition-colors flex items-center py-2 rounded-lg ${aboutDropdownOpen ? "text-blue-600" : ""}`}
              aria-haspopup="true"
              aria-expanded={aboutDropdownOpen}
              onClick={() => setAboutDropdownOpen((open) => !open)}
            >
              About
              {/* Simple chevron-down icon (Heroicons style) */}
              <svg className={`w-5 h-5 ml-1 transition-transform ${aboutDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
              </svg>
            </button>
            <AnimatePresence>
              {aboutDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 mt-3 w-44 bg-white rounded-xl shadow-lg z-30 border border-blue-100 overflow-hidden"
                >
                  <div className="flex flex-col">
                    <Link
                      href="/about/about-vamossy"
                      className="px-5 py-3 text-[#1e283c] hover:bg-blue-50 transition-colors"
                      onClick={() => setAboutDropdownOpen(false)}
                    >
                      About Vamossy
                    </Link>
                    <Link
                      href="/about/faq"
                      className="px-5 py-3 text-[#1e283c] hover:bg-blue-50 transition-colors"
                      onClick={() => setAboutDropdownOpen(false)}
                    >
                      FAQ
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" 
            className="hidden md:block bg-[#1f40af] text-white text-xl font-[500] px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            data-cal-link="dev-vamossy/discovery-call"
            data-cal-namespace="discovery-call"
            data-cal-config='{"layout":"month_view"}'
          >
            See How it Works
          </Link>
          {/* Mobile menu button */}
          <button className="md:hidden p-2 cursor-pointer" aria-label="Open menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" fill="#1e283c" stroke="#1e283c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white shadow-lg px-4 py-6 absolute top-20 left-0 w-full z-50"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="text-[#4b5562] text-lg hover:text-blue-600 transition-colors px-4 py-2 rounded">
                {link.name}
              </Link>
            ))}
            {/* Resources Dropdown for mobile */}
            <div className="flex flex-col">
              <button
                className="flex items-center justify-between text-[#4b5562] text-lg px-4 py-2 rounded hover:bg-blue-50 transition-colors w-full"
                onClick={() => setResourcesMobileDropdownOpen(open => !open)}
                aria-haspopup="true"
                aria-expanded={resourcesMobileDropdownOpen}
              >
                <span>Resources</span>
                <svg className={`w-5 h-5 ml-2 transition-transform ${resourcesMobileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>
              <AnimatePresence>
                {resourcesMobileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col"
                  >
                    <Link
                      href="/articles"
                      className="pl-8 pr-4 py-2 text-[#1e283c] hover:bg-blue-100 rounded transition-colors w-full"
                      onClick={() => {
                        setResourcesMobileDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Articles
                    </Link>
                    <Link
                      href="/case-studies"
                      className="pl-8 pr-4 py-2 text-[#1e283c] hover:bg-blue-100 rounded transition-colors w-full"
                      onClick={() => {
                        setResourcesMobileDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Case Studies
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* About Dropdown for mobile */}
            <div className="flex flex-col">
              <button
                className="flex items-center justify-between text-[#4b5562] text-lg px-4 py-2 rounded hover:bg-blue-50 transition-colors w-full"
                onClick={() => setAboutMobileDropdownOpen(open => !open)}
                aria-haspopup="true"
                aria-expanded={aboutMobileDropdownOpen}
              >
                <span>About</span>
                <svg className={`w-5 h-5 ml-2 transition-transform ${aboutMobileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>
              <AnimatePresence>
                {aboutMobileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col"
                  >
                    <Link
                      href="/about/about-vamossy"
                      className="pl-8 pr-4 py-2 text-[#1e283c] hover:bg-blue-100 rounded transition-colors w-full"
                      onClick={() => {
                        setAboutMobileDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      About Us
                    </Link>
                    <Link
                      href="/about/faq"
                      className="pl-8 pr-4 py-2 text-[#1e283c] hover:bg-blue-100 rounded transition-colors w-full"
                      onClick={() => {
                        setAboutMobileDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      FAQ
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="#" 
              className="bg-[#1f40af] text-white text-lg font-bold px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors mt-2"
              data-cal-link="dev-vamossy/discovery-call"
              data-cal-namespace="discovery-call"
              data-cal-config='{"layout":"month_view"}'
            >See How it Works</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
