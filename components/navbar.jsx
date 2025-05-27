"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
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

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center h-24">
        <h1 className="text-3xl font-bold text-blue-600 tracking-tight">YourBrand</h1>
        <nav className="flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative text-lg font-medium px-3 py-2 rounded transition-all duration-300
                ${pathname === item.href ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}
                before:content-[''] before:absolute before:-bottom-1 before:left-0 before:h-[2px] before:w-full before:scale-x-0 before:bg-blue-600 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100`
              }>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}