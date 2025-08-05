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
    let retryCount = 0;
    const maxRetries = 3;
    let authStateSubscription = null;

    const fetchUserRole = async (userId) => {
      try {
        console.log('[AuthContext] Fetching user role for:', userId);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();
        
        console.log('[AuthContext] Role fetch result:', {
          userData,
          userError: userError?.message,
          role: userData?.role
        });
        
        if (userError) {
          console.error('[AuthContext] Error fetching user role:', userError);
          return 'user'; // Default role
        }
        
        return userData?.role || 'user';
      } catch (roleError) {
        console.error('[AuthContext] Role fetch error:', roleError);
        return 'user'; // Default role
      }
    };

    const updateAuthState = async (session, source = 'unknown') => {
      if (!isMounted) {
        console.log('[AuthContext] Component unmounted, skipping auth state update');
        return;
      }

      console.log(`[AuthContext] Updating auth state from ${source}:`, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id?.substring(0, 8) + '...'
      });

      if (session?.user) {
        setSession(session);
        setStatus('authenticated');
        
        const userRole = await fetchUserRole(session.user.id);
        if (isMounted) {
          setRole(userRole);
        }
      } else {
        console.log('[AuthContext] No session, setting unauthenticated state');
        setSession(null);
        setRole(null);
        setStatus('unauthenticated');
      }
    };

    const getInitialSession = async () => {
      try {
        console.log('[AuthContext] Initializing auth session...');
        console.log('[AuthContext] Environment:', {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
          nodeEnv: process.env.NODE_ENV
        });

        // Only do health check in development
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthContext] Testing basic Supabase connection...');
          try {
            const testStart = Date.now();
            const testResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
              headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
              }
            });
            const testEnd = Date.now();
            console.log('[AuthContext] Supabase health check:', {
              status: testResponse.status,
              ok: testResponse.ok,
              responseTime: `${testEnd - testStart}ms`
            });
          } catch (healthError) {
            console.error('[AuthContext] Supabase health check FAILED:', healthError.message);
          }
        }

        // Remove the aggressive timeout and let the session fetch complete naturally
        console.log('[AuthContext] Fetching initial session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('[AuthContext] getSession result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          sessionId: session?.user?.id?.substring(0, 8) + '...',
          error: error?.message
        });
        
        if (error) {
          console.error('[AuthContext] Session error:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`[AuthContext] Retrying session fetch (${retryCount}/${maxRetries}) in ${2000 * retryCount}ms`);
            setTimeout(getInitialSession, 2000 * retryCount);
            return;
          }
          throw error;
        }
        
        await updateAuthState(session, 'initial-fetch');
        
      } catch (error) {
        console.error('[AuthContext] Auth initialization error:', error);
        if (isMounted) {
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      } finally {
        if (isMounted) {
          console.log('[AuthContext] Setting isInitialized to true');
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state change listener FIRST
    console.log('[AuthContext] Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) {
          console.log('[AuthContext] Component unmounted, ignoring auth state change');
          return;
        }
        
        console.log('[AuthContext] Auth state change:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id?.substring(0, 8) + '...'
        });
        
        // Handle OAuth redirect completion
        if (event === 'SIGNED_IN' && session) {
          console.log('[AuthContext] OAuth sign-in detected, updating state');
          await updateAuthState(session, 'oauth-signin');
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] Sign-out detected');
          await updateAuthState(null, 'signout');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('[AuthContext] Token refreshed');
          await updateAuthState(session, 'token-refresh');
        }
      }
    );

    authStateSubscription = subscription;

    // Small delay to allow auth state listener to be ready
    setTimeout(getInitialSession, 100);

    return () => {
      console.log('[AuthContext] Cleaning up auth context');
      isMounted = false;
      authStateSubscription?.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  const value = {
    status: isInitialized ? status : 'loading',
    session,
    role,
    isInitialized
  };

  console.log('[AuthContext] Current state:', {
    status: value.status,
    hasSession: !!session,
    role,
    isInitialized
  });

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
