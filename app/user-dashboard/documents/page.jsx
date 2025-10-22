"use client";

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import dynamic from 'next/dynamic';
import Spinner from '@/components/ui/spinner';

const UserDocumentsPage = dynamic(() => import('@/components/documents/UserDocumentsPage'), { ssr: false });
const AdminDocumentsPage = dynamic(() => import('@/components/documents/AdminDocumentsPage'), { ssr: false });

export default function DocumentsPage() {
  const { role, status } = useAuthWithRedirect();

  if (status === 'loading') {
    return <Spinner />;
  }

  if (role === 'admin') {
    return <AdminDocumentsPage />;
  }
  if (role === 'user' || role === 'worker') {
    return <UserDocumentsPage />;
  }
  
  return null;
}
