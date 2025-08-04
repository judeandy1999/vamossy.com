import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/client';

export function useAuthWithRedirect() {
  const router = useRouter();
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
              // Don't fail completely if role fetch fails
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

    getInitialSession();

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

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { 
    status: isInitialized ? status : 'loading', 
    session, 
    role,
    isInitialized 
  };
}
