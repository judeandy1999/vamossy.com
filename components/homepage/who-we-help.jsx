'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { clientTypes } from '@/data/data';
import Title from "@/components/ui/title";

export default function WhoWeHelpCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % clientTypes.length;
        scrollToItem(nextIndex);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToItem = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Dynamic item width calculation based on screen size
      const containerWidth = container.offsetWidth;
      const itemWidth = window.innerWidth < 768 ? containerWidth * 0.85 : 380; // Responsive width
      const gap = 24; // 6 * 4px (gap-6)
      const scrollPosition = index * (itemWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleItemClick = (index) => {
    setCurrentIndex(index);
    scrollToItem(index);
  };

  return (
    <div className="w-full bg-[#101010] py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Changed to a simpler flex layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          
          {/* Left Column - Title */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="space-y-6">
              <Title title="Who We Help" variant="h2" titlePosition="left" />
            </div>
          </div>

          {/* Right Column - Horizontal Scrolling Items */}
          <div className="lg:w-2/3 w-full">
            <div className="relative">
              {/* Horizontal Scroll Container */}
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitScrollbar: { display: 'none' }
                }}
              >
                {clientTypes.map((client, index) => (
                  <motion.div
                    key={index}
                    onClick={() => handleItemClick(index)}
                    className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                      // Responsive width classes
                      'w-80 sm:w-96 md:w-80 lg:w-96'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 h-full ${
                      index === currentIndex
                        ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Enhanced Yellow Circle Icon */}
                        {/* <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse opacity-75' 
                              : 'bg-white/20'
                          }`}></div>
                          <div className={`relative w-full h-full rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                            index === currentIndex
                              ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-yellow-500/25'
                              : 'bg-white/10'
                          }`}>
                            <Play size={16} className={`sm:w-[18px] sm:h-[18px] transition-colors duration-300 ${
                              index === currentIndex ? 'text-gray-900' : 'text-gray-300'
                            }`} />
                          </div>
                        </div> */}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold mb-2 transition-colors duration-300 leading-tight ${
                            index === currentIndex 
                              ? 'text-yellow-400 text-lg sm:text-xl' 
                              : 'text-gray-100 text-base sm:text-lg'
                          }`}>
                            {client.title}
                          </h3>
                          <div className="flex items-start space-x-3">
                            <div className={`h-0.5 mt-2 transition-all duration-300 flex-shrink-0 ${
                              index === currentIndex
                                ? 'w-6 sm:w-8 bg-gradient-to-r from-yellow-500 to-transparent'
                                : 'w-4 sm:w-6 bg-gradient-to-r from-white/40 to-transparent'
                            }`}></div>
                            <p className={`text-xs sm:text-sm font-light leading-relaxed transition-colors duration-300 ${
                              index === currentIndex ? 'text-gray-200' : 'text-gray-400'
                            }`}>
                              {client.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-2">
          <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed text-right">
            If you're scaling and need systems, not spreadsheets - we're your unfair advantage.
          </p>
        </div>
      </div>
    </div>
  );
}
