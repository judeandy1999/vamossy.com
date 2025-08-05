'use client';

import { AuthProvider } from "@/contexts/auth-context";

export default function ClientAuthProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
