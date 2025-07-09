'use client';
import { X } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/client';
import Spinner from '@/components/ui/spinner';

export default function CalendlyModal({ isOpen, onClose, user, onBookingSuccess }) {
  const modalRef = useRef(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [schedulingLink, setSchedulingLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCredits, setUserCredits] = useState(0);
  const [step, setStep] = useState('loading');
  const [calendlyScriptLoaded, setCalendlyScriptLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('loading');
      fetchEventTypes();
      fetchUserCredits();
      loadCalendlyScript();
    }
  }, [isOpen]);

  useEffect(() => {
    if (calendlyScriptLoaded && schedulingLink && step === 'booking') {
      setTimeout(() => {
        initializeCalendlyWidget(schedulingLink.booking_url);
      }, 100);
    }
  }, [calendlyScriptLoaded, schedulingLink, step]);

  const loadCalendlyScript = () => {
    if (window.Calendly) {
      setCalendlyScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="calendly.com"]');
    if (existingScript) {
      existingScript.onload = () => setCalendlyScriptLoaded(true);
      if (window.Calendly) {
        setCalendlyScriptLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      setCalendlyScriptLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load Calendly script');
    };
    document.head.appendChild(script);
  };

  const fetchEventTypes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch('/api/calendly/event-types', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEventTypes(data.collection || []);
        
        if (data.collection && data.collection.length > 0) {
          setSelectedEventType(data.collection[0]);
        }
        
        setStep('select');
      } else {
        throw new Error('Failed to fetch event types');
      }
    } catch (err) {
      setError(err.message);
      setStep('error');
    }
  };

  const fetchUserCredits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch('/api/users/credits', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits);
      }
    } catch (err) {
      console.error('Failed to fetch credits:', err);
    }
  };

  const createSchedulingLink = async () => {
    if (!selectedEventType || userCredits < 1) {
      setError('Insufficient credits or no event type selected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch('/api/calendly/scheduling-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          event_type_uri: selectedEventType.uri,
          max_event_count: 1
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSchedulingLink(data.resource);
        setStep('booking');
      } else {
        throw new Error(data.error || 'Failed to create scheduling link');
      }
    } catch (err) {
      setError(err.message);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const deductCredit = async (bookingDetails) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch('/api/users/deduct-credit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          booking_details: bookingDetails,
          credits_used: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.remaining_credits);
      } else {
        console.error('Failed to deduct credit');
      }
    } catch (err) {
      console.error('Error deducting credit:', err);
    }
  };

  const initializeCalendlyWidget = (bookingUrl) => {
    
    const widgetContainer = document.querySelector('.calendly-inline-widget');
    
    if (!widgetContainer) {
      setTimeout(() => initializeCalendlyWidget(bookingUrl), 100);
      return;
    }

    if (!window.Calendly) {
      console.error('Calendly script not loaded');
      return;
    }

    try {
      widgetContainer.innerHTML = '';
            
      window.Calendly.initInlineWidget({
        url: bookingUrl,
        parentElement: widgetContainer,
        prefill: {
          email: user?.email || '',
          firstName: user?.user_metadata?.first_name || '',
          lastName: user?.user_metadata?.last_name || '',
          name: user?.user_metadata?.name || user?.email?.split('@')[0] || ''
        }
      });

      window.addEventListener('message', handleCalendlyMessage);
    } catch (error) {
      setError('Failed to load booking calendar');
    }
  };

  const handleCalendlyMessage = async (e) => {
    if (e.data.event && e.data.event.indexOf('calendly') === 0) {
      
      if (e.data.event === 'calendly.event_scheduled') {
        await deductCredit(e.data.event_details);
        
        setStep('success');
        if (onBookingSuccess) {
          onBookingSuccess(e.data.event_details);
        }
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setStep('loading');
    setSchedulingLink(null);
    fetchEventTypes();
    fetchUserCredits();
  };

  const handleSelectEventType = (eventType) => {
    setSelectedEventType(eventType);
  };

  const handleProceedToBooking = () => {
    createSchedulingLink();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const renderContent = () => {
    switch (step) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <Spinner />
            <p className="mt-4 text-gray-300">Loading consultation options...</p>
          </div>
        );

      case 'select':
        return (
          <div className="p-6 w-full">
            <h3 className="text-xl font-semibold text-gray-200 mb-6 text-center">
              Select Consultation Type
            </h3>
            
            {userCredits < 1 ? (
              <div className="text-center">
                <div className="text-yellow-400 mb-4">
                  You don't have enough credits to book a consultation.
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Purchase Credits
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {eventTypes.map((eventType) => (
                  <div
                    key={eventType.uri}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedEventType?.uri === eventType.uri
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => handleSelectEventType(eventType)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-200">{eventType.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Duration: {eventType.duration} minutes
                        </p>
                        {eventType.description && (
                          <p className="text-sm text-gray-300 mt-2">
                            {eventType.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-yellow-400">
                          Uses 1 credit
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedEventType && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleProceedToBooking}
                      disabled={loading}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Creating booking...' : 'Proceed to Schedule'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'booking':
        return (
          <div className="w-full h-full flex flex-col">
            {!calendlyScriptLoaded || !schedulingLink ? (
              <div className="flex flex-col items-center justify-center p-8 h-full">
                <Spinner />
                <p className="mt-4 text-gray-300">Loading booking calendar...</p>
              </div>
            ) : (
              <div className="h-[600px] w-full">
                <div
                  className="calendly-inline-widget w-full h-full bg-white rounded-lg"
                  style={{ minWidth: '320px', height: '100%' }}
                />
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-300 mb-4">
              Your consultation has been scheduled successfully. You'll receive a confirmation email shortly.
            </p>
            <p className="text-sm text-yellow-400 mb-6">
              1 credit has been deducted. Remaining credits: {userCredits}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="p-6 text-center">
            <div className="text-red-400 mb-4">{error}</div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Cleanup event listener on unmount
  useEffect(() => {
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener('message', handleCalendlyMessage);
      }
    };
  }, []);

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
            className="relative rounded-2xl shadow-2xl border border-yellow-400/20 w-full max-w-sm sm:max-w-2xl md:max-w-4xl max-h-[95vh] overflow-hidden flex flex-col bg-gradient-to-br from-[#262626] to-gray-900 backdrop-blur-lg"
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
            <div className="w-full h-14 sm:min-h-16 flex items-center justify-between px-4 sm:px-8 select-none relative bg-gradient-to-br from-[#262626] to-gray-900 border-b border-yellow-400/20">
              <div className="flex items-center space-x-4">
                <span className="text-lg sm:text-2xl font-bold text-gray-200 tracking-wide">
                  Book Your Consultation
                </span>
                <div className="text-sm text-yellow-400">
                  Credits: {userCredits}
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer w-8 h-8 rounded-full border-2 border-yellow-500 bg-[#262626] hover:bg-gray-800 text-yellow-500 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Close modal"
              >
                <X size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            
            {/* Modal content */}
            <div className="flex-1 flex justify-center items-center w-full bg-[#262626] overflow-y-auto">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}