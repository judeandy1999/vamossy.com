import React from 'react';

export default function CustomModal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-base font-semibold text-gray-700 shadow transition-all duration-150 z-10"
          aria-label="Close modal"
        >
          ×
        </button>
        {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-3">{actions}</div>
      </div>
    </div>
  );
}
