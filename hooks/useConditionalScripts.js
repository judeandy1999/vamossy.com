'use client';
import { useEffect, useState } from 'react';
import { CookieManager } from '@/utils/cookieManager';

export const useConditionalScript = (scriptUrl, category = 'analytics') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = CookieManager.hasConsent();
      setHasConsent(consent);
      return consent;
    };

    // Initial check
    if (checkConsent() && !isLoaded) {
      loadScript();
    }

    // Listen for consent changes
    const handleStorageChange = (e) => {
      if (e.key === 'cookieConsent') {
        if (checkConsent() && !isLoaded) {
          loadScript();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [scriptUrl, isLoaded]);

  const loadScript = () => {
    if (isLoaded || !hasConsent) return;

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error(`Failed to load script: ${scriptUrl}`);
    
    document.head.appendChild(script);
  };

  return { isLoaded, hasConsent };
};

export const useGoogleAnalytics = (measurementId) => {
  const { isLoaded, hasConsent } = useConditionalScript(
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    'analytics'
  );

  useEffect(() => {
    if (isLoaded && hasConsent && typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', measurementId);
    }
  }, [isLoaded, hasConsent, measurementId]);

  return { isLoaded, hasConsent };
};
