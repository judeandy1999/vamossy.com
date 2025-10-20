'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/client';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  const fetchUserRole = async (userId) => {
    if (!userId) return 'user';
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      return error || !data ? 'user' : (data.role || 'user');
    } catch {
      return 'user';
    }
  };

  const updateAuthState = async (session) => {
    if (session?.user) {
      const userRole = await fetchUserRole(session.user.id);
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
        console.error('Auth initialization error:', error);
        if (mounted) {
          setStatus('unauthenticated');
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted && ['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'].includes(event)) {
          await updateAuthState(session);
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
