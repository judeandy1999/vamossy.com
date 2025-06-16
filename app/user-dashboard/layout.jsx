'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import Spinner from '@/components/ui/spinner';
import { ToastProvider } from '@/contexts/toastContext';

export default function UserDashboardLayout({ children }) {
  const { status, session } = useAuthWithRedirect();

  if (status === 'loading') {
    return <Spinner />;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}