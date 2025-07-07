// Cookie management utilities
export const CookieManager = {
  // Check if user has given consent
  hasConsent: () => {
    if (typeof window === 'undefined') return false;
    const consent = localStorage.getItem('cookieConsent');
    return consent === 'true';
  },

  // Check if user has explicitly rejected cookies (always false now since rejections aren't saved)
  hasRejected: () => {
    return false; // Rejections are not persisted
  },

  // Get consent status (null = not decided or rejected, true = accepted)
  // Rejections are not persisted so banner will appear again
  getConsentStatus: () => {
    if (typeof window === 'undefined') return null;
    const consent = localStorage.getItem('cookieConsent');
    return consent === 'true' ? true : null; // Only return true for explicit acceptance
  },

  // Set a cookie with consent check
  setCookie: (name, value, options = {}) => {
    if (typeof document === 'undefined') return false;
    
    // Always allow essential cookies
    const essentialCookies = ['cookieConsent', 'session', 'csrf', 'auth'];
    const isEssential = essentialCookies.some(essential => name.includes(essential));
    
    if (!isEssential && !CookieManager.hasConsent()) {
      console.warn(`Cookie "${name}" not set: User consent required`);
      return false;
    }

    const {
      expires = '',
      path = '/',
      domain = '',
      secure = true,
      sameSite = 'Lax'
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}`;
    
    if (expires) {
      if (typeof expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${expires}`;
      }
    }
    
    if (path) cookieString += `; path=${path}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (secure) cookieString += `; secure`;
    if (sameSite) cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
    return true;
  },

  // Get a cookie value
  getCookie: (name) => {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  },

  // Delete a cookie
  deleteCookie: (name, path = '/', domain = '') => {
    if (typeof document === 'undefined') return;
    
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path}`;
    if (domain) cookieString += `; domain=${domain}`;
    
    document.cookie = cookieString;
  },

  // Clear all non-essential cookies
  clearNonEssentialCookies: () => {
    if (typeof document === 'undefined') return;
    
    const essentialCookies = ['cookieConsent', 'session', 'csrf', 'auth'];
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const [name] = cookie.split('=');
      const trimmedName = name.trim();
      
      const isEssential = essentialCookies.some(essential => 
        trimmedName.includes(essential)
      );
      
      if (!isEssential) {
        CookieManager.deleteCookie(trimmedName);
      }
    });
  },

  // Initialize analytics based on consent
  initializeAnalytics: () => {
    if (!CookieManager.hasConsent()) return;
    
    // Initialize Google Analytics or other analytics services here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  },

  // Initialize marketing cookies based on consent
  initializeMarketing: () => {
    if (!CookieManager.hasConsent()) return;
    
    // Initialize marketing tools here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted'
      });
    }
  }
};

// Google Analytics consent mode helper
export const updateGoogleAnalyticsConsent = (granted) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('consent', 'update', {
    'analytics_storage': granted ? 'granted' : 'denied',
    'ad_storage': granted ? 'granted' : 'denied'
  });
};

// Hook for components to easily check consent status
export const useCookieConsentStatus = () => {
  if (typeof window === 'undefined') {
    return { hasConsent: false, hasRejected: false, status: null };
  }
  
  return {
    hasConsent: CookieManager.hasConsent(),
    hasRejected: CookieManager.hasRejected(),
    status: CookieManager.getConsentStatus()
  };
};
