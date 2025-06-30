'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import UserManagement from '@/components/admin/user-management';
import Spinner from '@/components/ui/spinner';

export default function UserManagementPage() {
  const { status } = useAuthWithRedirect();

  if (status === 'loading') {
    return <Spinner />;
  }

  return <UserManagement />;
}