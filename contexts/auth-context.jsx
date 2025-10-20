'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/client';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  // Add this to detect re-mounting
  console.log('[AuthProvider] Component mounted/re-mounted');

  const fetchUserRole = async (userId) => {
    if (!userId) return 'user';
    console.log('[AuthProvider] Fetching role for user ID:', userId);
    try {
      // Add timeout to the request
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
  };

  const updateAuthState = async (session, event) => {
    if (event === 'SIGNED_OUT') {
      setSession(null);
      setRole(null);
      setStatus('unauthenticated');
      return;
    }

    // Prevent redundant calls if session hasn't changed
    if (session?.user?.id && role) {
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
    } else {
      setSession(null);
      setRole(null);
      setStatus('unauthenticated');
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        if (mounted) {
          setStatus('unauthenticated');
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
  }, []);

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
