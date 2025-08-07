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
        let hasResolved = false;
        
        // Critical timing fix: Add small delay before role fetch
        const startRoleFetch = () => {
          roleTimeout = setTimeout(() => {
            if (!hasResolved) {
              hasResolved = true;
              resolve('user');
            }
          }, 2000);

          supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single()
            .then(({ data: userData, error }) => {
              clearTimeout(roleTimeout);
              
              if (!hasResolved) {
                hasResolved = true;
                if (error || !userData) {
                  resolve('user');
                } else {
                  const fetchedRole = userData.role || 'user';
                  resolve(fetchedRole);
                }
              } else {
                // Late update handling
                if (userData && userData.role && userData.role !== 'user' && isMounted) {
                  // Small delay to ensure React has processed previous state updates
                  setTimeout(() => {
                    if (isMounted) setRole(userData.role);
                  }, 0);
                }
              }
            })
            .catch(() => {
              clearTimeout(roleTimeout);
              if (!hasResolved) {
                hasResolved = true;
                resolve('user');
              }
            });
        };

        // Add micro-delay to prevent race conditions (this was the key fix!)
        setTimeout(startRoleFetch, 10);
      });
    };

    const updateAuthState = async (session, event = 'session_change') => {
      if (!isMounted) return;

      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        
        if (isMounted) {
          // Batch state updates to prevent race conditions
          const updateStates = () => {
            setSession(session);
            setRole(userRole);
            setStatus('authenticated');
          };

          // Use setTimeout to ensure proper state batching
          setTimeout(updateStates, 0);
        }
      } else {
        if (isMounted) {
          const updateStates = () => {
            setSession(null);
            setRole(null);
            setStatus('unauthenticated');
          };
          
          setTimeout(updateStates, 0);
        }
      }
    };

    const initializeAuth = async () => {
      return new Promise((resolve) => {
        initTimeout = setTimeout(() => {
          if (isMounted) {
            setSession(null);
            setRole(null);
            setStatus('unauthenticated');
            setIsInitialized(true);
          }
          resolve();
        }, 12000);

        // Add small delay before getting session (critical timing fix)
        setTimeout(() => {
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
        }, 50); // Critical delay
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
