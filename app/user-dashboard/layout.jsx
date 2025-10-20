'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import Spinner from '@/components/ui/spinner';
import { ToastProvider } from '@/contexts/toast-context';
import Toast from '@/components/shared/toast';
import Script from 'next/script';

export default function UserDashboardLayout({ children }) {
  const { status, session, isInitialized } = useAuthWithRedirect();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only redirect if we're fully initialized and not authenticated
    if (isInitialized && status === 'unauthenticated' && !hasRedirected) {
      setHasRedirected(true);
      router.replace('/login');
    }
  }, [status, isInitialized, hasRedirected, router]);

  // Show loading while checking authentication
  if (!isInitialized || status === 'loading') {
    return <Spinner />;
  }

  // Show loading while redirecting unauthenticated users
  if (status === 'unauthenticated') {
    return <Spinner />;
  }

  // Only render dashboard if authenticated
  if (status !== 'authenticated' || !session) {
    return <Spinner />;
  }

  return (
    <ToastProvider>
      {/* Hide Tidio in dashboard */}
      <Script id="hide-tidio" strategy="afterInteractive">
        {`
          // Hide Tidio widget if it exists
          function hideTidio() {
            const tidioFrame = document.querySelector('#tidio-chat');
            const tidioContainer = document.querySelector('[data-cy="chat"]');
            
            if (tidioFrame) {
              tidioFrame.style.display = 'none';
            }
            if (tidioContainer) {
              tidioContainer.style.display = 'none';
            }
            
            // Also try to find by iframe src
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
              if (iframe.src && iframe.src.includes('tidio')) {
                iframe.style.display = 'none';
              }
            });
          }

          // Run immediately and also after a delay to catch dynamically loaded content
          hideTidio();
          setTimeout(hideTidio, 1000);
          setTimeout(hideTidio, 3000);

          // Use MutationObserver to catch when Tidio loads
          const observer = new MutationObserver(hideTidio);
          observer.observe(document.body, { childList: true, subtree: true });
        `}
      </Script>
      
      <div className="flex h-screen bg-gray-50 relative">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toast />
    </ToastProvider>
  );
}