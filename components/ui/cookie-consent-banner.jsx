'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCookieConsent } from '@/contexts/cookie-consent-context';
import PrivacyPolicyModal from './privacy-policy-modal';
import CookiePolicyModal from './cookie-policy-modal';

export default function CookieConsentBanner() {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    if (showPrivacyModal || showCookieModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPrivacyModal, showCookieModal]);

  if (!showBanner) return null;

  const bannerVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      y: 100,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-6 md:bottom-6 md:max-w-md"
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white">Cookie Consent</h3>
                <button
                  onClick={rejectCookies}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
                  aria-label="Decline cookies"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">
                    We use cookies to improve your browsing experience.
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Read more in our{' '}
                    <button
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                      Privacy Notice
                    </button>
                    {' '}and{' '}
                    <button
                      onClick={() => setShowCookieModal(true)}
                      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                      Cookie Policy
                    </button>
                    .
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptCookies}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Allow cookies
                  </button>
                  <button
                    onClick={rejectCookies}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />

      {/* Cookie Policy Modal */}
      <CookiePolicyModal 
        isOpen={showCookieModal} 
        onClose={() => setShowCookieModal(false)} 
      />
    </>
  );
}
