'use client';

import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from '@/data/data';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import Title from "@/components/ui/title";

export default function ProofThroughPerspective() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => 
      prev === testimonials.testimonialCards.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.testimonialCards.length - 1 : prev - 1
    );
  };

  const getCurrentTestimonial = () => {
    return testimonials.testimonialCards[currentIndex];
  };

  const getVisibleTestimonials = () => {
    const result = [];

    const leftIndex = currentIndex === 0 ? testimonials.testimonialCards.length - 1 : currentIndex - 1;
    result.push({
      ...testimonials.testimonialCards[leftIndex],
      position: 'left',
      actualIndex: leftIndex,
      id: `left-${leftIndex}`
    });
    
    result.push({
      ...testimonials.testimonialCards[currentIndex],
      position: 'center',
      actualIndex: currentIndex,
      id: `center-${currentIndex}`
    });
    
    const rightIndex = currentIndex === testimonials.testimonialCards.length - 1 ? 0 : currentIndex + 1;
    result.push({
      ...testimonials.testimonialCards[rightIndex],
      position: 'right',
      actualIndex: rightIndex,
      id: `right-${rightIndex}`
    });
    
    return result;
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const mobileSlideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const mobileTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  const TestimonialCard = ({ testimonial, isMobile = false }) => (
    <div className={`backdrop-blur-sm rounded-2xl p-8 border shadow-2xl h-full flex flex-col transition-all duration-700 ease-out ${
      isMobile || testimonial.position === 'center'
        ? 'bg-gray-700/90 border-yellow-400/50 shadow-yellow-400/20'
        : 'bg-gray-800/80 border-gray-600/50'
    }`}>
      <div className="mb-6">
        <h3 className={`text-white text-lg md:text-lg lg:text-xl font-semibold transition-colors duration-700 ${
          isMobile || testimonial.position === 'center' ? 'text-yellow-100' : 'text-white'
        }`}>
          {testimonial.role}
        </h3>
      </div>

      <div className="flex space-x-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className={`fill-current transition-colors duration-700 ${
              isMobile || testimonial.position === 'center' ? 'text-yellow-300' : 'text-yellow-400'
            }`}
            size={20}
          />
        ))}
      </div>

      <div className="flex-1 mb-6">
        <p className={`text-gray-300 text-md md:text-lg lg:text-xl font-light transition-colors duration-700 ${
          isMobile || testimonial.position === 'center' ? 'text-gray-100' : 'text-gray-200'
        }`}>
          "{testimonial.quote}"
        </p>
      </div>

      <div className="flex justify-end">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${
          isMobile || testimonial.position === 'center' ? 'bg-yellow-400/30' : 'bg-white/20'
        }`}>
          <span className={`text-2xl font-bold transition-colors duration-700 ${
            isMobile || testimonial.position === 'center' ? 'text-yellow-200' : 'text-white'
          }`}>"</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen py-16 lg:py-24 px-4 bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-800 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}

         <Title title={testimonials.title} variant="h2"/>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute top-[40%] transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all duration-300"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-[40%] transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all duration-300"
          >
            <ChevronRight className="text-white" size={24} />
          </button>

          {/* Mobile/Tablet View - Single Testimonial with Smooth Sliding */}
          <div className="relative px-4 overflow-hidden lg:hidden">
            <div className="flex justify-center">
              <div className="w-full max-w-md relative" style={{ minHeight: '350px' }}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={mobileSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={mobileTransition}
                    className="absolute inset-0 w-full"
                  >
                    <TestimonialCard testimonial={getCurrentTestimonial()} isMobile={true} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Desktop View - Three Testimonials */}
          <div className="relative p-16 overflow-hidden hidden lg:block">
            <motion.div 
              className="grid grid-cols-3 gap-8"
              key={`desktop-${currentIndex}`}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="relative"
                  initial={{ 
                    scale: testimonial.position === 'center' ? 1.1 : 0.95,
                    opacity: testimonial.position === 'center' ? 1 : 0.75,
                    y: testimonial.position === 'center' ? -10 : 0
                  }}
                  animate={{ 
                    scale: testimonial.position === 'center' ? 1.1 : 0.95,
                    opacity: testimonial.position === 'center' ? 1 : 0.75,
                    y: testimonial.position === 'center' ? -10 : 0,
                    zIndex: testimonial.position === 'center' ? 20 : 5
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeInOut",
                    delay: index * 0.1
                  }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 lg:mt-8 space-x-3">
            {testimonials.testimonialCards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  const newDirection = index > currentIndex ? 1 : -1;
                  setDirection(newDirection);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentIndex 
                    ? 'bg-yellow-400 w-8 shadow-lg shadow-yellow-400/50' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Current testimonial counter */}
          <div 
            className="flex justify-center mt-6"
          >
            <span className="text-white/60 text-sm">
              {currentIndex + 1} of {testimonials.testimonialCards.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}