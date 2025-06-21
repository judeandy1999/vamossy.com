'use client';

import { motion } from "framer-motion";
import { tieredServices } from '@/data/data';
import { Check, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Title from "@/components/ui/title";

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

  const renderFeatureValue = (value) => {
    if (value === "included") {
      return (
        <div className="flex justify-center">
          <Check className="text-yellow-500" size={24} />
        </div>
      );
    } else if (value === "partial") {
      return (
        <div className="flex justify-center">
          <Minus className="text-yellow-500" size={24} />
        </div>
      );
    } else if (value) {
      return (
        <div className="text-center">
          <Check className="text-yellow-500 mx-auto mb-2" size={24} />
          <p className="text-white text-sm">{value}</p>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <section className="relative min-h-screen py-16 lg:py-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
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
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-auto border border-gray-700/50 scrollbar-always-visible"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={tableVariants}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#fbbf24 #374151'
          }}
        >
          <div className="min-w-3xl ">
          {/* Header Row */}
            <div className="grid grid-cols-4 bg-yellow-500">
              <div className="flex items-center p-4 md:p-8 border-r border-gray-600">
                <h4 className="text-gray-900 text-lg md:text-lg lg:text-xl font-semibold">
                  Feature / Deliverable
                </h4>
              </div>
              {tieredServices.tiers.map((tier) => (
                <div key={tier.id} className="p-4 md:p-8 text-center border-r border-gray-600 last:border-r-0">
                  <div className="mb-4">
                    <img 
                      src={tier.icon} 
                      alt={tier.name}
                      className="w-22 h-22 mx-auto mb-2 rounded-xl shadow-lg"
                    />
                  </div>
                  <h5 className="text-xl md:text-2xl font-bold text-gray-900">
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
              {tieredServices.tiers.map((tier) => (
                <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                  <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.idealFor}</p>
                </div>
              ))}
            </motion.div>

            {/* Core Offer*/}
            <motion.div 
              className="grid grid-cols-4 border-b border-gray-600"
              variants={rowVariants}
            >
              <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
                <h6 className="text-lg font-semibold text-white">Core Offer</h6>
              </div>
              {tieredServices.tiers.map((tier) => (
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
              {tieredServices.tiers.map((tier) => (
                <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                  <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">{tier.investment}</p>
                </div>
              ))}
            </motion.div>

            {/* Feature Rows */}
            <motion.div 
              className="grid grid-cols-4 border-b border-gray-600"
              variants={rowVariants}
            >
              <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
                <h6 className="text-lg font-semibold text-white">Funnel Audit (GPT-Powered)</h6>
              </div>
              {tieredServices.tiers.map((tier) => (
                <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                  {renderFeatureValue(tier.features["Funnel Audit (GPT-Powered)"])}
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="grid grid-cols-4"
              variants={rowVariants}
            >
              <div className="p-4 md:p-8 bg-gray-700 border-r border-gray-600">
                <h6 className="text-lg font-semibold text-white">Full KPI + Marketing Activity Audit</h6>
              </div>
              {tieredServices.tiers.map((tier) => (
                <div key={tier.id} className="p-4 md:p-8 bg-gray-800 border-r border-gray-600 last:border-r-0">
                  {renderFeatureValue(tier.features["Full KPI + Marketing Activity Audit"])}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}