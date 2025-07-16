'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { CookieManager, updateGoogleAnalyticsConsent } from '@/utils/cookieManager';

const CookieConsentContext = createContext();

export const CookieConsentProvider = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState(null); 
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const status = CookieManager.getConsentStatus();
    if (status === true) {
      setConsentGiven(true);
      setShowBanner(false);
      
      CookieManager.initializeAnalytics(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID);
      CookieManager.initializeMarketing();
      updateGoogleAnalyticsConsent(true);
    } else {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    setConsentGiven(true);
    setShowBanner(false);
    localStorage.setItem('cookieConsent', 'true');
    CookieManager.setCookie('cookieConsent', 'true', { expires: 365 }); 
    
    CookieManager.initializeAnalytics(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID);
    CookieManager.initializeMarketing();
    updateGoogleAnalyticsConsent(true);
  };

  const rejectCookies = () => {
    setConsentGiven(false);
    setShowBanner(false);
    
    CookieManager.clearNonEssentialCookies();
    updateGoogleAnalyticsConsent(false);
  };

  const resetConsent = () => {
    setConsentGiven(null);
    setShowBanner(true);
    localStorage.removeItem('cookieConsent');
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
