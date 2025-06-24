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
    
    <Container variant="gradient" isTable={true}>
      {/* Title */}
      <Title title={tieredServicesPage.title} variant="h2" />
      <Title title={tieredServicesPage.subtitle} variant="h2" />

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
        viewport={{ amount: 0.3 }}
        variants={tableVariants}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#fbbf24 #374151',
        }}
      >
        <div className="min-w-3xl ">
        {/* Header Row */}
          <div className="grid grid-cols-4 bg-yellow-500">
            <div className="flex items-center p-4 md:p-8 border-r border-gray-600">
              <h4 className="text-gray-900 text-lg md:text-xl lg:text-2xl font-bold">
                Service Name
              </h4>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 text-center border-r border-gray-600 last:border-r-0">
                <div className="mb-4">
                  <img 
                    src={tier.icon} 
                    alt={tier.name}
                    className="w-22 h-22 mx-auto mb-2 rounded-xl shadow-lg"
                  />
                </div>
                <h5 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {tier.name}
                </h5>
              </div>
            ))}
          </div>

          {/* Ideal For Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Ideal For</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.idealFor}</p>
              </div>
            ))}
          </motion.div>

          {/* Partnership Type Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Partnership Type</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.partnershipType}</p>
              </div>
            ))}
          </motion.div>

          {/* Core Offer Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Core Offer</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.coreOffer}</p>
              </div>
            ))}
          </motion.div>

          {/* Investment Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Investment</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.investment}</p>
              </div>
            ))}
          </motion.div>

          {/* Duration Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Duration</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.duration}</p>
              </div>
            ))}
          </motion.div>

          {/* Type Of Collaboration Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Type of Collaboration</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.typeOfCollaboration}</p>
              </div>
            ))}
          </motion.div>

          {/* AI Advantages Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">AI Advantages</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.aiAdvantages}</p>
              </div>
            ))}
          </motion.div>

          {/* Consultations Row */}
          <motion.div 
            className="grid grid-cols-4 border-b border-gray-600"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Consultations</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.consultations}</p>
              </div>
            ))}
          </motion.div>

          {/* Deliverables Row */}
          <motion.div 
            className="grid grid-cols-4"
            variants={rowVariants}
          >
            <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
              <h6 className="text-lg font-semibold text-white">Deliverables</h6>
            </div>
            {tieredServicesPage.tiers.map((tier) => (
              <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.deliverables}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </motion.div>
      </div>
    </Container>
  );
}