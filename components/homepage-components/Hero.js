'use client';

import React, { useState } from 'react';
import { Calendar, CalendarCheck, User, ShieldCheck, LineChart, Bot, Handshake, Rocket } from 'lucide-react';
import OpportunitiesModal from '../ui/opportunities-modal';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReviewOpportunitiesClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="bg-gradient-to-br from-[#f3f6f9] to-[#f1f6fe] h-auto min-h-[90dvh] flex w-full px-4 py-8 md:py-0">
        <div className="max-w-7xl mx-auto my-auto flex flex-col md:flex-row items-center md:justify-between w-full relative">
          <div className="max-w-xl w-full">
            <h1 className="text-3xl text-[#1e283c] md:text-[58px] font-bold leading-tight mb-4 md:mb-6">
              Offering Launch Ready <span className="text-[#1f40af]">Low-risk, High-ROI</span> <span className="text-[#3c82f6]">Ecommerce Projects on a Platter</span>
            </h1>
            <p className="text-base md:text-md text-[#505a66] mb-6 md:mb-8">
              Ecommerce growth, without the guesswork. Find your best ecommerce opportunities with Vamossy, get matched to the ideal vetted partner, get your project assessed, your specification prepared, and be ready to implement cutting-edge solutions.
            </p>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8 w-full md:pb-8">
              <button 
                onClick={handleReviewOpportunitiesClick}
                className="cursor-pointer border border-[#1f40af] text-[#1f40af] font-semibold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-200 flex items-start justify-center w-full md:w-auto"
              >
                <User className="w-5 h-5 mr-2" />
                Review by Best Opportunities
              </button>
              <button
                className="cursor-pointer bg-[#1f40af] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 hover:scale-105 transition-transform duration-200 flex items-start justify-center w-full md:w-auto"
                data-cal-link="dev-vamossy/discovery-call"
                data-cal-namespace="discovery-call"
                data-cal-config='{"layout":"month_view"}'
              >
                <Calendar className="w-5 h-5 mr-2" />
                See How it Works
              </button>
            </div>
            <div className="md:absolute md:bottom-4 flex flex-col sm:flex-row gap-4 md:gap-8 text-sm text-[#505a66] mt-2 md:mt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1f40af]" />
                Proven Partners
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[#1f40af]" />
                Faster ROI
              </div>
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-[#1f40af]" />
                Independent & Transparent
              </div>
            </div>
          </div>
          <div className="mt-8 md:-mt-30 md:ml-12 w-full max-w-xl max-h-xl">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-center items-center rotate-0 md:rotate-[6deg]">
              <div className="grid grid-cols-2 gap-x-12 md:gap-x-12 gap-y-6 md:gap-y-12 w-full">
                <div className="flex flex-col items-center">
                  <span className="bg-[#1f40af] text-white rounded-full p-4 flex items-center justify-center mb-2">
                    <Handshake className="h-6 w-6 md:w-8 md:h-8" />
                  </span>
                  <span className="font-medium text-sm text-[#1e283c]">Agency Match</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="bg-[#3c82f6] text-white rounded-full p-4 flex items-center justify-center mb-2">
                    <Bot className="h-6 w-6 md:w-8 md:h-8" />
                  </span>
                  <span className="font-medium text-sm text-[#1e283c]">AI Integration</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="bg-[#3c82f6] text-white rounded-full p-4 flex items-center justify-center mb-2">
                    <LineChart className="h-6 w-6 md:w-8 md:h-8" />
                  </span>
                  <span className="font-medium text-sm text-[#1e283c]">Growth Systems</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="bg-[#1f40af] text-white rounded-full p-4 flex items-center justify-center mb-2">
                    <Rocket className="h-6 w-6 md:w-8 md:h-8" />
                  </span>
                  <span className="font-medium text-sm text-[#1e283c]">Scale Fast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <OpportunitiesModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default Hero;
