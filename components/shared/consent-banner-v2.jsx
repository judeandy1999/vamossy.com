"use client";
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent:v1');
    if (!consent) {
      // Show banner after a short delay for first-time visitors
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent:v1', 'accepted');
    setShowBanner(false);
    
    // Update gtag consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent:v1', 'rejected');
    setShowBanner(false);
    
    // Update gtag consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#090d0dfa] border-t border-gray-700 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#85bd41] rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
              <h3 id="cookie-banner-title" className="text-xl font-bold text-white">
                Cookie Preferences
              </h3>
            </div>
            <p className="text-gray-200 leading-relaxed max-w-3xl mb-3">
              We use cookies to enhance your browsing experience, provide personalized content, 
              and analyze our traffic. By accepting, you help us improve our services and 
              provide you with better recommendations.
            </p>
            <p className="text-gray-300 text-sm">
              By using our services, you also agree to our{' '}
              <Link 
                href="/terms-of-service" 
                className="text-[#85bd41] hover:text-[#548816] underline transition-colors"
              >
                Terms of Service
              </Link>
              {', and '}
              <Link 
                href="/privacy-policy" 
                className="text-[#85bd41] hover:text-[#548816] underline transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
            <button
              onClick={rejectCookies}
              className="cursor-pointer px-6 py-3 text-sm font-semibold text-gray-800 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-300 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 shadow-sm"
            >
              Reject All
            </button>
            <button
              onClick={acceptCookies}
              className="cursor-pointer px-6 py-3 text-sm font-semibold text-white bg-[#85bd41] hover:bg-[#548816] border-2 border-[#85bd41] hover:border-[#548816] rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#85bd41] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}