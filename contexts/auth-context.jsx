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
        console.log('Initializing auth session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(getInitialSession, 1000 * retryCount);
            return;
          }
          throw error;
        }
        
        if (!isMounted) return;

        if (session?.user) {
          setSession(session);
          setStatus('authenticated');
          
          // Fetch role with retry logic
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (userError) {
              console.error('Error fetching user role:', userError);
              setRole('user'); // Default role
            } else {
              setRole(userData?.role || 'user');
            }
          } catch (roleError) {
            console.error('Role fetch error:', roleError);
            setRole('user'); // Default role
          }
        } else {
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
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

    // Set up auth state change listener
    console.log('Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state change:', event, !!session);
        
        if (session?.user) {
          setSession(session);
          setStatus('authenticated');
          
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            setRole(userData?.role || 'user');
          } catch (error) {
            console.error('Error fetching user role:', error);
            setRole('user');
          }
        } else {
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      }
    );

    // Get initial session after setting up listener
    getInitialSession();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

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
