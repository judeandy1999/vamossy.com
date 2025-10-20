'use client';

import { AuthProvider } from "@/contexts/auth-context";

// Add React.memo to prevent unnecessary re-renders
import { memo } from 'react';

function ClientAuthProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default memo(ClientAuthProvider);
