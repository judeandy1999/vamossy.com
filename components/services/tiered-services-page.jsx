'use client';

import { motion } from "framer-motion";
import { tieredServicesPage } from '@/data/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function TieredServices() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    
    <Container variant="gray-gradient" isTable={true}>
      {/* Title */}
      <Title title={tieredServicesPage.title} variant="h2" />
      {tieredServicesPage.subtitle && (
        <Title title={tieredServicesPage.subtitle} variant="h2" />
      )}

      {/* Mobile Scroll Hint */}
      <div className="block lg:hidden mb-4">
        <div className="flex items-center justify-center space-x-2 text-yellow-500">
          <ChevronLeft size={20} />
          <span className="text-sm">Swipe to see all tiers</span>
          <ChevronRight size={20} />
        </div>
      </div>

      <div className="relative">
        {/* Scroll Arrows for Desktop */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-400 text-gray-900 p-2 rounded-full shadow-lg transition-all duration-300 hidden lg:block"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-400 text-gray-900 p-2 rounded-full shadow-lg transition-all duration-300 hidden lg:block"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Gradient Fade Effects */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
        )}
        
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>
        )}

      {/* Services Table */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-auto border border-gray-700/50 scrollbar-always-visible"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0 }}
        variants={tableVariants}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#fbbf24 #374151',
        }}
        ref={scrollContainerRef}
        onScroll={checkScrollability}
      >
        <div className="min-w-3xl ">
          {/* Header Row */}
          <div className="grid grid-cols-4 bg-yellow-500 h-65 items-stretch">
            <div className="flex items-center p-4 md:p-8 border-r border-gray-600">
              <h4 className="text-gray-900 text-2xl md:text-2xl lg:text-3xl font-bold">
                Service Name
              </h4>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div
                key={tier.id}
                className="p-4 md:p-3 text-center border-r border-gray-600 last:border-r-0 flex flex-col items-center justify-start h-full"
              >
                <div className="mb-4 w-full flex justify-center">
                  <img 
                    src={tier.icon} 
                    alt={tier.name}
                    className="w-32 h-32 mx-auto mb-2 rounded-xl shadow-lg"
                  />
                </div>
                <h5 className="text-2xl md:text-3xl font-semibold text-gray-900 break-words w-full">
                  {tier.name}
                </h5>
              </div>
            ))}
          </div>

      {/* Table Rows */}
      {[
        {label: "Ideal For", key: "idealFor"},
        {label: "Partnership Type", key: "partnershipType"},
        {label: "Core Offer", key: "coreOffer"},
        {label: "Investment", key: "investment"},
        {label: "Duration", key: "duration"},
        {label: "Type of Collaboration", key: "typeOfCollaboration"},
        {label: "AI Advantages", key: "aiAdvantages"},
        {label: "Consultations", key: "consultations"},
        {label: "Deliverables", key: "deliverables"},
      ].map((row, idx) => (
          <motion.div
            key={row.key}
            className={`grid grid-cols-4 border-b border-gray-600 h-48 items-stretch ${
              idx % 2 === 1 ? 'bg-yellow-500' : 'bg-gray-800'
            } ${idx === 8 ? '' : ''}`}
            variants={rowVariants}
          >
            <div className={`p-4 md:p-8 border-r border-gray-600 flex items-center font-semibold ${
              idx % 2 === 1 ? 'text-gray-900' : 'text-white'
            }`}>
              <h6 className="text-2xl">{row.label}</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`p-4 md:p-8 border-r border-gray-600 last:border-r-0 flex items-stretch justify-center overflow-y-auto ${
                  idx % 2 === 1 ? 'text-gray-900' : 'text-gray-300'
                }`}
              >
                <div className="w-full">
                  <p className="text-md md:text-lg lg:text-xl font-light w-full">
                    {tier[row.key]}
                  </p>
                  <div className="h-4" />
                </div>
              </div>
            ))}
          </motion.div>
            ))}
        </div>
      </motion.div>
      </div>
    </Container>
  );
}