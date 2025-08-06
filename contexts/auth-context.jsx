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
    let initTimeout = null;
    let roleTimeout = null;

    const fetchUserRole = async (userId) => {
      if (!userId || !isMounted) return 'user';
      
      return new Promise((resolve) => {
        // Set timeout to prevent hanging
        roleTimeout = setTimeout(() => {
          resolve('user');
        }, 10000); // 10 seconds max

        supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single()
          .then(({ data: userData, error }) => {
            clearTimeout(roleTimeout);
            if (error || !userData) {
              resolve('user');
            } else {
              resolve(userData.role || 'user');
            }
          })
          .catch(() => {
            clearTimeout(roleTimeout);
            resolve('user');
          });
      });
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
      return new Promise((resolve) => {
        // Set timeout to prevent hanging on initialization
        initTimeout = setTimeout(() => {
          if (isMounted) {
            setSession(null);
            setRole(null);
            setStatus('unauthenticated');
            setIsInitialized(true);
          }
          resolve();
        }, 12000); // 12 seconds max for initialization

        supabase.auth.getSession()
          .then(async ({ data: { session }, error }) => {
            clearTimeout(initTimeout);
            
            if (!error && session) {
              await updateAuthState(session, 'initialization');
            } else {
              if (isMounted) {
                setSession(null);
                setRole(null);
                setStatus('unauthenticated');
              }
            }
          })
          .catch(() => {
            clearTimeout(initTimeout);
            if (isMounted) {
              setSession(null);
              setRole(null);
              setStatus('unauthenticated');
            }
          })
          .finally(() => {
            if (isMounted) {
              setIsInitialized(true);
            }
            resolve();
          });
      });
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
      if (initTimeout) clearTimeout(initTimeout);
      if (roleTimeout) clearTimeout(roleTimeout);
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
