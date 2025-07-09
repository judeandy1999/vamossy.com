'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { CookieManager, updateGoogleAnalyticsConsent } from '@/utils/cookieManager';

const CookieConsentContext = createContext();

export const CookieConsentProvider = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState(null); // null = not decided, true = accepted, false = rejected
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const status = CookieManager.getConsentStatus();
    if (status === true) {
      // Only set as accepted if explicitly accepted
      setConsentGiven(true);
      setShowBanner(false);
      
      // Initialize services based on consent
      CookieManager.initializeAnalytics(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID);
      CookieManager.initializeMarketing();
      updateGoogleAnalyticsConsent(true);
    } else {
      // Show banner if no consent given or if previously rejected
      // (since we don't save rejections permanently)
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500); // Slightly longer delay for better page load experience
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    setConsentGiven(true);
    setShowBanner(false);
    localStorage.setItem('cookieConsent', 'true');
    
    // Set consent cookie
    CookieManager.setCookie('cookieConsent', 'true', { expires: 365 }); // 1 year
    
    // Initialize analytics and marketing
    CookieManager.initializeAnalytics(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID);
    CookieManager.initializeMarketing();
    updateGoogleAnalyticsConsent(true);
  };

  const rejectCookies = () => {
    setConsentGiven(false);
    setShowBanner(false);
    
    // Don't save rejection permanently - only for this session
    // This allows the banner to appear again on subsequent visits
    CookieManager.clearNonEssentialCookies();
    updateGoogleAnalyticsConsent(false);
  };

  const resetConsent = () => {
    setConsentGiven(null);
    setShowBanner(true);
    localStorage.removeItem('cookieConsent');
    // Remove consent cookie
    CookieManager.deleteCookie('cookieConsent');
    CookieManager.clearNonEssentialCookies();
    updateGoogleAnalyticsConsent(false);
  };

  return (
    <CookieConsentContext.Provider value={{
      consentGiven,
      showBanner,
      acceptCookies,
      rejectCookies,
      resetConsent
    }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
