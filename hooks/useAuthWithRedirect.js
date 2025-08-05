import { useAuth } from '@/contexts/auth-context';

export function useAuthWithRedirect() {
  // Simply return the centralized auth state
  return useAuth();
}
