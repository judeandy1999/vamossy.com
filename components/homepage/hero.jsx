'use client';
import { Typewriter } from "react-simple-typewriter";
import { motion } from 'framer-motion';
import { Check, X, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import Spinner from "../ui/spinner";

export default function Hero() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const h1Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 400 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'linear',
        delay: 0.2,
      },
    },
  };

  useEffect(() => {
    if (showCalendar) {
      setIsCalendarLoading(true);

      const existingScript = document.querySelector('script[src*="MeetingsEmbedCode.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      setTimeout(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
        script.async = true;
        
        script.onload = () => {
          setTimeout(() => {
            setIsCalendarLoading(false);
          }, 1500);
        };
        
        script.onerror = () => {
          setIsCalendarLoading(false);
        };
        
        document.head.appendChild(script);
      }, 100);
    }
  }, [showCalendar, calendarKey]);

  const handleBookNowClick = (e) => {
    e.preventDefault();
    setCalendarKey(prev => prev + 1);
    setShowCalendar(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
    setIsCalendarLoading(false);

    setTimeout(() => {
      const script = document.querySelector('script[src*="MeetingsEmbedCode.js"]');
      if (script) {
        script.remove();
      }
    }, 100);
  };

  return (
    <>
      <section className="relative text-gray-100 h-[100vh] w-full overflow-hidden">
        <motion.div
          className="relative z-1 h-full flex flex-col items-center justify-center text-center px-6 text-gray-100"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-xl md:text-5xl lg:text-6xl font-semibold md:max-w-[80%] leading-tight"
            variants={h1Variants}
          >
            YOUR AI-POWERED ECOMMERCE GROWTH CONSULTING AGENCY
          </motion.h1>
          <motion.h1
            className="lg:mt-4 text-xl md:text-2xl lg:text-3xl font-normal max-w-full leading-tight"
            variants={h1Variants}
          >
            From Chaos to Clarity. From Funnels to Frameworks
          </motion.h1>
          <motion.h4 
            className="lg:mt-8 text-gray-200 text-md md:text-xl lg:text-2xl mt-4 font-light md:max-w-[60%] leading-tight"
            variants={h1Variants}
          >
            We engineer AI-powered growth systems that scale eCommerce brands - profitable, predictable, and without the guesswork.
          </motion.h4>
          <motion.h4 
            className="lg:mt-8 text-gray-200 text-md md:text-xl lg:text-2xl mt-4 font-light md:max-w-[60%] leading-tight"
            variants={h1Variants}
          >
            <Typewriter
              words={[
                "Your next 10x isn't in more tools - it's in better logic.",
              ]}
              cursor
              cursorStyle="|"
              loop={true}
              typeSpeed={60}
              deleteSpeed={30}
              delaySpeed={2000}
            />
          </motion.h4>
          <motion.div
            variants={buttonVariants}
            className="mt-4 lg:mt-8 flex flex-col md:flex-row gap-4 items-center">
            <button
              onClick={handleBookNowClick}
              className="cursor-pointer lg:text-xl border-2 border-gray-600 group flex items-center justify-center gap-2 py-4 px-2 md:py-6 w-[20rem] bg-[#262626] text-gray-200 hover:scale-105 hover:bg-gray-800 font-semibold rounded-xl transition"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 p-1 rounded-full border-2 border-yellow-500 bg-[#262626] group-hover:bg-gray-800 flex items-center justify-center">
                <Check size={22} className="text-yellow-500" />
              </div>
              Book a Growth Audit
            </button>
            <button
              onClick={() => window.location.href = '/submit-brief'}
              className="cursor-pointer lg:text-xl border-2 border-gray-600 group flex items-center justify-center gap-2 py-4 px-2 md:py-6 w-[20rem] bg-[#262626] text-gray-200 hover:scale-105 hover:bg-gray-800 font-semibold rounded-xl transition"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 p-1 rounded-full border-2 border-yellow-500 bg-[#262626] group-hover:bg-gray-800 flex items-center justify-center">
                <FileText size={20} className="text-yellow-500" />
              </div>
              Submit a Brief
            </button>
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 w-full h-62 bg-gradient-to-b from-transparent to-[#262626] z-10"></div>
      </section>

      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg text-center max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={handleCloseCalendar}
              className="bg-[#0091ae] cursor-pointer absolute top-4 right-4 text-gray-100 hover:scale-110 z-100 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            >
              <X size={16} className="text-gray-200" />
            </button>
            
            {isCalendarLoading && (
              <Spinner />
            )}
            <p className="pt-4 text-lg md:text-3xl text-extrabold text-[#0091ae]">Book a Growth Audit!</p>
            <div 
              key={calendarKey}
              className={`meetings-iframe-container ${isCalendarLoading ? 'opacity-0' : 'opacity-100'} flex mx-auto text-center flex-col-reverse transition-opacity duration-500`}
              data-src="https://meetings-eu1.hubspot.com/gergely-vamossy?embed=true"
            ></div>
          </div>
        </div>
      )}
    </>
  );
}
