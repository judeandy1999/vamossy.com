'use client';
import { X } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

export default function GoogleCalendarModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Optionally, you can focus the modal or do other effects here
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="relative rounded-2xl shadow-2xl border border-[#2d3748]/20 max-w-2xl w-full max-h-[90vh] overflow-auto flex flex-col items-center transition-all duration-200 bg-white/80 backdrop-blur-lg"
        style={{
          pointerEvents: 'auto',
          boxShadow: '0 8px 32px 0 rgba(24, 26, 57, 0.72)',
          border: '1.5px solid rgba(255,255,255,0.18)',
        }}
      >
        {/* Modal header */}
        <div
          className="w-full h-14 flex items-center justify-between px-8 select-none relative bg-gradient-to-br from-[#192A8C] to-[#03002E] rounded-t-2xl shadow-sm"
          style={{ zIndex: 20, userSelect: 'none' }}
        >
          <span className="text-xl font-bold text-white tracking-wide drop-shadow-sm">Book a Growth Audit!</span>
          <button
            onClick={onClose}
            className="bg-white/80 border border-[#2563eb]/30 hover:bg-[#2563eb]/10 text-[#2563eb] rounded-full w-11 h-11 flex items-center justify-center shadow-md transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2563eb] z-10"
            style={{ zIndex: 30 }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {/* Modal content */}
        <div className="flex justify-center items-center w-full bg-transparent">
          <div className="rounded-xl overflow-hidden border border-[#2563eb]/20 shadow bg-white/90 backdrop-blur-md">
            <iframe
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2QwK7QwK7QwK7QwK7QwK7QwK7Q" // <-- Replace with your real Google Calendar appointment link
              style={{ border: 0 }}
              width="700"
              height="500"
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
              allowFullScreen
              className="w-[90vw] max-w-[700px] h-[60vh] md:h-[500px] bg-white/95"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}