'use client';
import Link from 'next/link';
import { Linkedin, Twitter, Youtube, Instagram, Facebook } from 'lucide-react';

export default function FooterV2() {
  const footerSections = [
    {
      title: "Why WebCraft Pro",
      links: [
        { name: "Full Solution", href: "/services" },
        { name: "Platform", href: "/about" },
        { name: "Framework", href: "/services" },
        { name: "Implementation", href: "/services" },
        { name: "Integrations", href: "/services" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Pricing", href: "/pricing" },
        { name: "Learning Center", href: "/articles" },
        { name: "Webinars", href: "/articles" },
        { name: "Book", href: "/articles" },
        { name: "Substack", href: "#" },
        { name: "Customer Stories", href: "/our-work" },
        { name: "Partnership Program", href: "/contact" }
      ]
    },
    {
      title: "Get Started",
      links: [
        { name: "Schedule a Demo", href: "/contact" },
        { name: "Watch Demo Videos", href: "/our-work" },
        { name: "Request Trial Account", href: "/signup" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" }
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-[#2a2a2a] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Logo and Social Links */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-white">Vamossy</span>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#85bd41] transition-colors duration-200 group"
                  aria-label={social.label}
                >
                  <social.icon 
                    size={16} 
                    className="text-gray-400 group-hover:text-white transition-colors duration-200" 
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col items-center space-y-6">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center items-center space-x-4 text-sm">
              <p className="text-sm text-gray-400">
                © 2025 Vamossy. All Rights Reserved.
              </p>
              {legalLinks.map((link, index) => (
                <span key={index} className="flex items-center">
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600 ml-4">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}