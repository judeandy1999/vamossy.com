"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("vamossycomcookieConsent");
    if (!consent) setShow(true);
    else if (consent === "accepted") grantConsent();
  }, []);

  const grantConsent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "granted",
      });
      window.gtag("config", SITE.gaId);
    }
  };

  const accept = () => {
    localStorage.setItem("vamossycomcookieConsent", "accepted");
    setShow(false);
    grantConsent();
  };

  const reject = () => {
    localStorage.setItem("vamossycomcookieConsent", "rejected");
    setShow(false);
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-title">
      <div className="site-wrap cookie-inner">
        <div>
          <p id="cookie-title" className="cookie-title">
            Analytics cookies
          </p>
          <p>
            This site uses Google Analytics 4 to measure page views and research
            downloads. Analytics runs only if you accept. See the{" "}
            <a href="/privacy-policy">privacy policy</a>.
          </p>
        </div>
        <div className="cookie-actions">
          <button type="button" className="btn-ghost" onClick={reject}>
            Reject
          </button>
          <button type="button" className="btn-solid" onClick={accept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
