'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7daysAgo', label: 'Last 7 days' },
  { value: '14daysAgo', label: 'Last 14 days' },
  { value: '30daysAgo', label: 'Last 30 days' },
  { value: '90daysAgo', label: 'Last 90 days' },
];

export default function DateRangeSelector({ value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = dateRangeOptions.find(option => option.value === value);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium
          ${disabled 
            ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        `}
      >
        <Calendar className="w-4 h-4" />
        <span>{selectedOption?.label || 'Last 7 days'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                    ${value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
