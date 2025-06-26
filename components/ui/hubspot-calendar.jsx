'use client';
import { X } from 'lucide-react';

export default function GoogleCalendarModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg text-center max-w-4xl w-full max-h-[90vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="bg-[#0091ae] cursor-pointer absolute top-4 right-4 text-gray-100 hover:scale-110 z-100 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          <X size={16} className="text-gray-200" />
        </button>
        <p className="pt-4 text-lg md:text-3xl text-extrabold text-[#0091ae]">Book a Growth Audit!</p>
        <div className="flex justify-center items-center py-6">
          <iframe
            src="https://calendar.app.google/kravWCZVvGL8YApK9"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}