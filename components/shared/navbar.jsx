'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useAuthWithRedirect();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/user-dashboard' || pathname.startsWith('/user-dashboard/')) {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'Articles', href: '/articles' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-xs z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="py-2 flex justify-between items-center h-15 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <div className="text-3xl md:text-5xl font-bold text-[#195850]">
                Vamossy
              </div>
            </Link>
          </div>

          {/* CTA Button & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:block mr-8">
              <div className="flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#3A3A3A] hover:text-[#85bd41] text-2xl font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <button
              className="bg-[#195850] cursor-pointer text-white px-6 py-2 rounded-lg font-medium text-xl hover:bg-[#548816] transition-all duration-100"
              data-cal-link="dev-vamossy/consultation"
              data-cal-namespace="consultation"
              data-cal-config='{"layout":"month_view"}'
            >
              Get Free Consultation
            </button>

            {/* <Link
              key="login"
              href='/login'
              className={`px-3 py-2 rounded-md text-2xl font-medium transition-colors duration-200 ${
                pathname === 'user-dashboard' ? 'text-[#85bd41]' : 'text-[#3A3A3A] hover:text-[#85bd41]'
              }`}
            >
              Login
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-[#85bd41] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {session ? (
                <Link
                  key="dashboard"
                  href='/user-dashboard'
                  className={`transition-colors duration-300 ${
                    pathname === 'user-dashboard' ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-400'
                  }`}
                >
                  Go to Dashboard
                </Link>
              ): (
                <>
                  <Link
                    href="#contact"
                    className="bg-[#B8860B] text-white block px-3 py-2 rounded-lg font-medium text-center mt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Free Preview
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-[#85bd41] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
