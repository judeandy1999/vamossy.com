'use client';
import { X } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoogleCalendarModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Optionally, you can focus the modal or do other effects here
    }
  }, [isOpen]);

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            ref={modalRef}
            className="relative rounded-2xl shadow-2xl border border-yellow-400/20 w-full max-w-sm sm:max-w-2xl md:max-w-3xl max-h-[95vh] overflow-hidden flex flex-col bg-gradient-to-br from-[#262626] to-gray-900 backdrop-blur-lg"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              pointerEvents: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 193, 7, 0.2)',
            }}
          >
            {/* Modal header */}
            <div className="w-full h-14 sm:h-16 flex items-center justify-between px-4 sm:px-8 select-none relative bg-gradient-to-br from-[#262626] to-gray-900 border-b border-yellow-400/20">
              <span className="text-lg sm:text-2xl font-bold text-gray-200 tracking-wide">Book a Growth Audit!</span>
              <button
                onClick={onClose}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-500 bg-[#262626] hover:bg-gray-800 text-yellow-500 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Close modal"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            {/* Modal content */}
            <div className="flex-1 flex justify-center items-center w-full p-2 sm:p-6 bg-[#262626]">
              <div className="rounded-xl overflow-hidden border border-yellow-400/30 shadow-2xl bg-gray-900/50 backdrop-blur-md w-full">
                <iframe
                  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2QwK7QwK7QwK7QwK7QwK7QwK7Q" // <-- Replace with your real Google Calendar appointment link
                  style={{ border: 0 }}
                  frameBorder="0"
                  scrolling="no"
                  title="Google Calendar"
                  allowFullScreen
                  className="w-full h-[400px] sm:h-[500px] bg-white rounded-xl"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}