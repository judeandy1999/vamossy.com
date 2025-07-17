'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { clientTypes } from '@/data/data';
import Title from "@/components/ui/title";

export default function WhoWeHelpCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-cycle through items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clientTypes.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % clientTypes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + clientTypes.length) % clientTypes.length);
  };

  const slideVariants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
  };

  const transition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.3 },
  };

  return (
    <div className="w-full bg-[#101010] py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Column - Title */}
          <div className="text-center lg:text-left">
            <div className="text-center md:text-left">
              <Title title="Who We Help" variant="h2" titlePosition="left" />
            </div>
          </div>

          {/* Right Column - Carousel Content */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {/* Navigation Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 group"
                  aria-label="Previous client type"
                >
                  <ChevronLeft className="text-white group-hover:text-yellow-400 transition-colors" size={20} />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 group"
                  aria-label="Next client type"
                >
                  <ChevronRight className="text-white group-hover:text-yellow-400 transition-colors" size={20} />
                </button>
              </div>

              {/* Indicators */}
              <div className="flex space-x-2">
                {clientTypes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-yellow-400 w-6 shadow-lg shadow-yellow-400/50'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to client type ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Carousel Content */}
            <div className="relative h-33 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="absolute inset-0 flex items-center"
                >
                  <div className="w-full">
                    <div className="flex items-start space-x-2">
                      {/* Enhanced Yellow Circle Icon */}
                      <div className="relative w-12 h-12 flex-shrink-0 mt-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-75"></div>
                        <div className="relative w-full h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/25">
                          <Play size={18} className="text-gray-300" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-gray-100 text-xl md:text-2xl lg:text-3xl font-bold mb-3">
                          {clientTypes[currentIndex].title}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-500 to-transparent"></div>
                          <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">
                            {clientTypes[currentIndex].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Text */}
            <div className="mt-2">
              <p className="text-gray-300 text-base md:text-md font-light">
                If you're scaling and need systems, not spreadsheets - we're your unfair advantage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
