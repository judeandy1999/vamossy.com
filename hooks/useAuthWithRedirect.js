import { useAuth } from '@/contexts/auth-context';

export function useAuthWithRedirect() {
  return useAuth();
}
