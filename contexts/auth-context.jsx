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

    const getInitialSession = async () => {
      try {
        console.log('[AuthContext] Initializing auth session...');
        
        // Clear any potentially stale session FIRST
        console.log('[AuthContext] Clearing any stale session data...');
        try {
          await supabase.auth.signOut({ scope: 'local' });
          // Clear localStorage
          Object.keys(localStorage)
            .filter(key => key.startsWith('sb-'))
            .forEach(key => localStorage.removeItem(key));
          console.log('[AuthContext] Stale session cleared');
        } catch (clearError) {
          console.warn('[AuthContext] Error clearing stale session:', clearError);
        }
        
        console.log('[AuthContext] Environment:', {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
          nodeEnv: process.env.NODE_ENV
        });

        // Add simple Supabase health check
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

        // Fixed timeout promise (no signOut here)
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout - realtime connection may be slow')), 8000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]);
        
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
            console.log(`[AuthContext] Retrying session fetch (${retryCount}/${maxRetries}) in ${1000 * retryCount}ms`);
            setTimeout(getInitialSession, 1000 * retryCount);
            return;
          }
          throw error;
        }
        
        if (!isMounted) {
          console.log('[AuthContext] Component unmounted, skipping session update');
          return;
        }

        if (session?.user) {
          console.log('[AuthContext] User found, setting authenticated state');
          setSession(session);
          setStatus('authenticated');
          
          // Fetch role with retry logic
          try {
            console.log('[AuthContext] Fetching user role for:', session.user.id);
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            console.log('[AuthContext] Role fetch result:', {
              userData,
              userError: userError?.message,
              role: userData?.role
            });
            
            if (userError) {
              console.error('[AuthContext] Error fetching user role:', userError);
              setRole('user'); // Default role
            } else {
              setRole(userData?.role || 'user');
            }
          } catch (roleError) {
            console.error('[AuthContext] Role fetch error:', roleError);
            setRole('user'); // Default role
          }
        } else {
          console.log('[AuthContext] No user found, setting unauthenticated state');
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
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

    // Set up auth state change listener
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
        
        if (session?.user) {
          setSession(session);
          setStatus('authenticated');
          
          try {
            console.log('[AuthContext] Fetching role for auth state change');
            const { data: userData, error: roleError } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            console.log('[AuthContext] Role fetch in state change:', {
              userData,
              roleError: roleError?.message
            });
            
            if (roleError) {
              console.error('[AuthContext] Error fetching user role in state change:', roleError);
            }
            
            setRole(userData?.role || 'user');
          } catch (error) {
            console.error('[AuthContext] Error fetching user role in state change:', error);
            setRole('user');
          }
        } else {
          console.log('[AuthContext] No session in state change, setting unauthenticated');
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      }
    );

    // Get initial session after setting up listener
    getInitialSession();

    return () => {
      console.log('[AuthContext] Cleaning up auth context');
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  // Add this to your context value
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
