'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/utils/client';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const currentUserIdRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Enhanced debugging
  console.log('[AuthProvider] Render at:', new Date().toISOString());


  // Add unmount detection
  useEffect(() => {
    console.log('[AuthProvider] Component mounted');

    return () => {
      console.log('[AuthProvider] Component UNMOUNTING');
    };
  }, []);

  const fetchUserRole = useCallback(async (userId) => {
    if (!userId) return 'user';
    console.log('[AuthProvider] Fetching role for user ID:', userId);
    try {
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve({ data: { role: 'user' } }), 5000)
      );

      const queryPromise = supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      const { data } = await Promise.race([queryPromise, timeoutPromise]);
      if (!data) {
        return 'user';
      }

      const userRole = data.role || 'user';
      return userRole;
      
    } catch (error) {
      return 'user';
    }
  }, []);

  const updateAuthState = useCallback(async (session, event) => {
    if (event === 'SIGNED_OUT') {
      setSession(null);
      setRole(null);
      setStatus('unauthenticated');
      currentUserIdRef.current = null;
      return;
    }

    // Prevent redundant calls if session hasn't changed
    if (session?.user?.id && session?.user?.id === currentUserIdRef.current) {
      console.log('[AuthProvider] Session unchanged, skipping role fetch');
      return;
    }
    
    if (session?.user) {
      console.log('[AuthProvider] User session detected:', session.user);
      const userRole = await fetchUserRole(session.user.id);
      console.log('[AuthProvider] User role fetched:', userRole);
      setSession(session);
      setRole(userRole);
      setStatus('authenticated');
      currentUserIdRef.current = session.user.id;
    } else {
      setSession(null);
      setRole(null);
      setStatus('unauthenticated');
      currentUserIdRef.current = null;
    }
  }, [fetchUserRole]);

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initAuth = async () => {
      if (isInitializedRef.current) return; // Prevent double initialization
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          await updateAuthState(session);
          isInitializedRef.current = true;
        }
      } catch (error) {
        if (mounted) {
          setStatus('unauthenticated');
          isInitializedRef.current = true;
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted && ['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'].includes(event)) {
          await updateAuthState(session, event);
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  const value = {
    status,
    session,
    role,
    isInitialized: status !== 'loading'
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
