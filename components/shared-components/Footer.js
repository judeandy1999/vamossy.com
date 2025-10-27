'use client';
import React from "react";
import { usePathname } from 'next/navigation';

const footerLinks = [
  {
    heading: "Company",
    links: [
      { label: "About Vamossy", href: "#" },
      { label: "How We Work", href: "#" },
      { label: "Why Clients Appreciate Us", href: "#" },
      { label: "For Agencies (Apply)", href: "#" },
      { label: "Contact / Book a Call", href: "#" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Agency Match & Pilot", href: "#" },
      { label: "AI Quick-Wins Sprint", href: "#" },
      { label: "Ongoing Program Management", href: "#" },
      { label: "Curated Agency Network", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "AI in Action: Insights & Case Studies", href: "#" },
      { label: "Agency Brief Template (PDF)", href: "#" },
      { label: "AI Pilot Checklist", href: "#" },
      { label: "Effort vs. Impact Matrix", href: "#" },
    ],
  },
  {
    heading: "Legal & Trust",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Data Processing Addendum (DPA)", href: "#" },
      { label: "Security & AI Use Policy", href: "#" },
      { label: "Cookie Preferences", href: "#" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
    
  // Hide footer on user-dashboard pages
  if (pathname?.startsWith('/user-dashboard') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <footer className="bg-[#0f1729] text-[#e5e7eb] pt-12 pb-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h4 className="font-bold mb-3 text-[#f7f7f8]">{section.heading}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:underline hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="my-8 border-[#232a39]" />
        <div className="bg-[#1e283c] rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="font-bold text-lg text-white flex-1 col-span-2">Business Details</div>
          <div className=" text-sm flex-1 col-span-2 md:col-span-1">
            <div className="font-bold text-white">Vamossy Digital Ltd.</div>
            <div>Company No: 12345678 · VAT: EU123456789</div>
            <div>Registered Office: 123 Business Street, London, UK</div>
          </div>
          <div className="text-sm flex-1">
            <div>
              Support: <a href="mailto:hello@vamossy.com" className="underline">hello@vamossy.com</a> · +44 20 1234 5678
            </div>
            <div>Hours: Mon–Fri, 09:00–17:00 GMT</div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-8 text-xs text-[#a3a7b7] gap-2">
          <div>© 2025 Vamossy Digital Ltd. All rights reserved.</div>
          <div className="flex items-center gap-3">
            {/* <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white">Sitemap</a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}