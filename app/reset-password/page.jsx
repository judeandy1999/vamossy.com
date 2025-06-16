'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/forms/reset-password-form';
import Spinner from '@/components/ui/spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ResetPasswordForm />
    </Suspense>
  );
}