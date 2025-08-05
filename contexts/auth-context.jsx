'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/client';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    const fetchUserRole = async (userId) => {
      if (!userId || !isMounted) return 'user';
      
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (error) {
          return 'user';
        }
        
        return userData?.role || 'user';
      } catch (error) {
        return 'user';
      }
    };

    const updateAuthState = async (session, event = 'session_change') => {
      if (!isMounted) return;

      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        
        if (isMounted) {
          setSession(session);
          setRole(userRole);
          setStatus('authenticated');
        }
      } else {
        if (isMounted) {
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        await updateAuthState(session, 'initialization');
      } catch (error) {
        if (isMounted) {
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;        
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            await updateAuthState(session, event);
            break;
          case 'SIGNED_OUT':
            await updateAuthState(null, event);
            break;
          default:
            break;
        }
      }
    );

    subscription = authSubscription;
    
    initializeAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    status: isInitialized ? status : 'loading',
    session,
    role,
    isInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
