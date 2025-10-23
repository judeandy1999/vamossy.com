'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FloatingCTA() {
  const pathname = usePathname();
      
  // Hide footer on user-dashboard pages
  if (pathname?.startsWith('/user-dashboard')) {
    return null;
  }

  const [isVisible, setIsVisible] = useState(true);

  // Hide CTA when user scrolls to footer or contact sections
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      const contactSection = document.getElementById('contact');
      
      if (footer || contactSection) {
        const rect = footer?.getBoundingClientRect() || contactSection?.getBoundingClientRect();
        const shouldHide = rect && rect.top < window.innerHeight + 100;
        setIsVisible(!shouldHide);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1729] shadow-2xl border-t border-[#232a39]"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Main CTA Content */}
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 text-[#e5e7eb]">
                  <Calendar className="w-5 h-5 text-[#f7f7f8]" />
                  <span className="font-semibold text-sm md:text-base">
                    Book a call and discuss ready, actionable steps
                  </span>
                </div>
                
                {/* Always Visible Services List */}
                <div className="hidden md:flex items-center gap-2 text-xs text-[#a3a7b7] ml-4">
                  <span>Project Plan</span>
                  <ArrowRight className="w-3 h-3 text-[#f7f7f8]" />
                  <span>Matchmaking</span>
                  <ArrowRight className="w-3 h-3 text-[#f7f7f8]" />
                  <span>Specification & Overview</span>
                  <ArrowRight className="w-3 h-3 text-[#f7f7f8]" />
                  <span>AI Assessment</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Book Call Button - Using data attributes like other components */}
                <button
                  className="cursor-pointer bg-[#1f40af] text-white font-semibold px-4 md:px-6 py-2 rounded-lg shadow hover:bg-[#232a39] hover:scale-105 transition-all duration-200 flex items-center gap-2 text-sm md:text-base"
                  data-cal-link="dev-vamossy/discovery-call"
                  data-cal-namespace="discovery-call"
                  data-cal-config='{"layout":"month_view"}'
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Book Call</span>
                  <span className="sm:hidden">Call</span>
                </button>

                {/* Dismiss Button */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-[#a3a7b7] hover:text-white transition-colors rounded-md hover:bg-[#1e283c]"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}