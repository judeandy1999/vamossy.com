'use client';
import { createContext, useContext, useState, useRef } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const timeoutRef = useRef(null);

  const showToast = (message, type = 'info') => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, type, visible: true });
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
      timeoutRef.current = null;
    }, 4000); // Increased to 4 seconds for better UX
  };

  const hideToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};