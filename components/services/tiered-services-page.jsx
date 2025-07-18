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
    
    <Container variant="black" isTable={true}>
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
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden rounded-2xl custom-scrollbar"
          onScroll={checkScrollability}
          tabIndex={0}
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', scrollbarColor: '#fbbf24 #374151' }}
        >
          <motion.div
            className="bg-gray-800/60 backdrop-blur-sm rounded-2xl min-w-[900px] border border-gray-700/50"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0 }}
            variants={tableVariants}
          >
            <div className="min-w-3xl">
              {/* Header Row */}
              <div className="grid grid-cols-4 bg-gradient-to-r from-gray-900 via-slate-800 to-blue-800 h-50 items-stretch rounded-t-3xl shadow-2xl overflow-hidden border-b-4 border-blue-500/70">
                <div className="flex items-center justify-left p-8 border-r border-blue-700/60 rounded-tl-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900/80 backdrop-blur-md">
                  <h4 className="text-cyan-300 text-2xl md:text-4xl font-black tracking-tight drop-shadow-lg">
                    Service Name
                  </h4>
                </div>
                {tieredServicesPage.tiers.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-center p-8 border-r border-blue-700/60 last:border-r-0 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900/80 backdrop-blur-md ${idx === tieredServicesPage.tiers.length - 1 ? 'rounded-tr-3xl' : ''}`}
                  >
                    <h5 className="text-2xl md:text-4xl font-black text-cyan-200 w-full tracking-tight drop-shadow-lg">
                      {tier.name}
                    </h5>
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {[
                { label: "Custom / Standard Consultation", key: "customStandardConsultation" },
                { label: "Market & Competitor Audit", key: "marketCompetitorAudit" },
                { label: "Quick Wins Audit, and Implementation specification", key: "quickWinsAudit" },
                { label: "360°Growth Consulting", key: "growthConsulting" },
                { label: "360°Growth Execution", key: "growthExecution" },
              ].map((row, idx) => (
                <motion.div
                  key={row.key}
                  className={`grid min-h-[150px] md:min-h-[250px] grid-cols-4 border-b border-blue-700/40 items-stretch text-sm md:text-base lg:text-lg ${
                    idx % 2 === 1 ? 'bg-gradient-to-r from-slate-800/80 via-blue-900/60 to-gray-900/80' : 'bg-gradient-to-r from-gray-900/80 via-slate-900/60 to-blue-900/80'
                  }`}
                  variants={rowVariants}
                >
                  <div className={`p-4 md:p-8 border-r border-blue-700/40 flex items-center font-semibold h-full justify-start text-cyan-200`}>
                    <h6 className="text-lg md:text-2xl text-left drop-shadow-lg">{row.label}</h6>
                  </div>
                  {tieredServicesPage.tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`items-center p-2 md:p-6 border-r border-blue-700/40 last:border-r-0 flex h-full text-white bg-slate-900/70 backdrop-blur-sm`}
                    >
                      <div className="w-full">
                        <p className="text-md md:text-lg lg:text-xl font-medium w-full">
                          {tier[row.key]}
                        </p>
                      </div>
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