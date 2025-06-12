'use client';
import { Typewriter } from "react-simple-typewriter";
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
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

  const h4Variants = {
    hidden: { opacity: 0, x: 500 },
    visible: {
      opacity: 1,
      x: 0,
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
          className="text-shadow-sm relative z-1 h-full flex flex-col items-center justify-center text-center px-6 text-gray-100"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-shadow-sm text-xl md:text-5xl lg:text-6xl font-light md:max-w-[80%] leading-tight"
            variants={h1Variants}
          >
            Ecommerce Growth Solutions and
          </motion.h1>
          <motion.h1
            className="text-shadow-sm text-2xl md:text-5xl lg:text-7xl font-bold max-w-full leading-tight"
            variants={h1Variants}
          >
            Lasting competitive advantage
          </motion.h1>
          <motion.h4 
            className="text-gray-200 text-md md:text-xl lg:text-2xl mt-4 font-light md:max-w-[60%] leading-tight"
            variants={h4Variants}
          >
            <Typewriter
              words={[
                "Cutting-edge marketing solutions at scale, designed to be the new industry standard! Created by unique eCommerce know-how, and extraordinary AI resources."
              ]}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={2000}
            />
          </motion.h4>
          <motion.div
            variants={buttonVariants}
            className="flex items-center flex-col md:flex-row max-w-[80%] md:w-3xl md:h-[120px] rounded-lg p-2 md:p-8 mt-4 md:mt-8 flex justify-between bg-gradient-to-r from-[#a87b00]/70 to-yellow-500/70"
          >
            <p className="text-center mb-2 md:mb-0 md:text-start text-md md:text-xl text-gray-200 font-bold flex items-center max-w-md text-shadow-sm">Book a free discovery call - open up new horizons for your business!</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookNowClick}
                className="cursor-pointer group flex items-center justify-center gap-2 py-2 px-2 md:py-3 w-[10rem] bg-[#333] text-gray-200 hover:scale-105 hover:bg-gray-800 font-semibold rounded-full transition"
              >
                <div className="w-5 h-5 md:w-7 md:h-7 rounded-full border-1 border-white bg-[#333] group-hover:bg-gray-800 flex items-center justify-center">
                  <Check size={16} className="text-gray-200" />
                </div>
                Book now
              </button>
            </div>
          </motion.div>
        </motion.div>
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
            <p className="pt-4 text-lg md:text-3xl text-extrabold text-[#0091ae]">Book a free discovery call!</p>
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
