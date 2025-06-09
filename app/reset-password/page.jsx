'use client';

import { Suspense } from 'react';
import ResetPasswordForm from './reset-password-form';
import Spinner from '@/components/ui/spinner';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ResetPasswordForm />
    </Suspense>
  );
}