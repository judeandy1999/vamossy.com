'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Spinner from "@/components/ui/spinner";

export default function HubSpotCalendar({ isOpen, onClose }) {
  const [calendarKey, setCalendarKey] = useState(0);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen, calendarKey]);

  const handleClose = () => {
    setIsCalendarLoading(false);
    onClose();

    setTimeout(() => {
      const script = document.querySelector('script[src*="MeetingsEmbedCode.js"]');
      if (script) {
        script.remove();
      }
    }, 100);
  };

  const handleOpen = () => {
    setCalendarKey(prev => prev + 1);
  };

  useEffect(() => {
    if (isOpen) {
      handleOpen();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg text-center max-w-4xl w-full max-h-[90vh] overflow-auto relative">
        <button
          onClick={handleClose}
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
  );
}