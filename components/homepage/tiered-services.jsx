'use client';

import { motion } from "framer-motion";
import { tieredServices } from '@/data/data';
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

  const rowHeights = [
    200, // Core Offer
    180,  // Duration
    100, // Type of Collaboration
    160, // AI Advantages
    220,  // Consultations
    140, // Deliverables
  ];

  return (
    
    <Container variant="gradient" isTable={true}>
      {/* Title */}
      <Title title={tieredServices.title} variant="h2" />
      <Title title={tieredServices.subtitle} variant="h2" />

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
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden rounded-2xl custom-scrollbar"
          onScroll={checkScrollability}
          tabIndex={0}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl min-w-[900px] border border-gray-700/50"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0 }}
            variants={tableVariants}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#fbbf24 #374151',
            }}
          >
            <div className="min-w-3xl ">
              {/* Header Row */}
              <div className="grid grid-cols-4 bg-yellow-500 h-50 items-stretch rounded-t-3xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-center p-8 border-r border-gray-600 rounded-tl-3xl">
                  <h4 className="text-gray-900 text-2xl md:text-4xl font-black tracking-tight">
                    Our Solutions
                  </h4>
                </div>
                {tieredServices.tiers.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-center p-8 border-r border-gray-600 last:border-r-0 h-full
                      ${idx === tieredServices.tiers.length - 1 ? 'rounded-tr-3xl' : ''}
                    `}
                  >
                    <h5 className="text-2xl md:text-4xl font-black text-gray-900 w-full tracking-tight">
                      {tier.name}
                    </h5>
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {[
                { label: "Core Offer", key: "coreOffer" },
                { label: "Duration", key: "duration" },
                { label: "Type of Collaboration", key: "typeOfCollaboration" },
                { label: "AI Advantages", key: "aiAdvantages" },
                { label: "Consultations", key: "consultations" },
                { label: "Deliverables", key: "deliverables" },
              ].map((row, idx) => (
                <motion.div
                  key={row.key}
                  className={`grid min-h-[150px] md:min-h-[200px] grid-cols-4 border-b border-gray-700 items-stretch text-sm md:text-base lg:text-lg ${
                    idx % 2 === 1 ? 'bg-yellow-500/10' : 'bg-gray-800/80'
                  }`}
                  variants={rowVariants}
                >
                  <div className={`p-4 md:p-8 border-r border-gray-700 flex items-center font-semibold h-full justify-start ${
                    idx % 2 === 1 ? 'text-gray-300' : 'text-gray-300'
                  }`}>
                    <h6 className="text-lg md:text-2xl text-left">{row.label}</h6>
                  </div>
                  {tieredServices.tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`items-center p-2 md:p-6 border-r border-gray-700 last:border-r-0 flex h-full ${
                        idx % 2 === 1 ? 'text-gray-300' : 'text-gray-200'
                      }`}
                    >
                      {/* Render the cell content directly */}
                      {tier[row.key]}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}