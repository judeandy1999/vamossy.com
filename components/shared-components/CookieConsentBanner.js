'use client';

import { useEffect, useState } from 'react';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('vamossycomcookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      // Initialize Google Analytics if consent was previously given
      initializeGoogleAnalytics();
    }
  }, []);

  const initializeGoogleAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted'
      });
      window.gtag('config', 'G-8Y6KGXJE9K');
    }
  };

  const handleAccept = () => {
    localStorage.setItem('vamossycomcookieConsent', 'accepted');
    setShowBanner(false);
    initializeGoogleAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem('vamossycomcookieConsent', 'rejected');
    setShowBanner(false);
    
    // Block Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e283c] border-t border-[#374151] z-50 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4 py-4 justify-between">
          <div className="flex-1 max-w-4xl">
            <p className="text-[#e5e7eb] text-md leading-relaxed mb-2">
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can manage your preferences or reject non-essential cookies by clicking &quot;Reject All&quot;.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <a 
                href="/privacy-policy" 
                className="text-[#a3a7b7] hover:text-white underline transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-service" 
                className="text-[#a3a7b7] hover:text-white underline transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-6 py-2.5 text-sm font-medium text-[#e5e7eb] hover:text-white border border-[#4b5563] hover:border-[#6b7280] hover:bg-[#374151]/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6b7280] focus:ring-offset-2 focus:ring-offset-[#1e283c]"
            >
              Reject
            </button>
            
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 text-sm font-medium bg-white text-[#1e283c] hover:bg-[#f3f4f6] rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1e283c] shadow-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;