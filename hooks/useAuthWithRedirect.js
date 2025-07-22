import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/client';

export function useAuthWithRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (isMounted) {
        if (session) {
          setSession(session);
          setStatus('authenticated');
          
          // Fetch role separately
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            setRole(userData?.role || null);
          } catch (error) {
            console.error('Error fetching user role:', error);
            setRole(null);
          }
        } else {
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          if (session) {
            setSession(session);
            setStatus('authenticated');
            
            try {
              const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              setRole(userData?.role || null);
            } catch (error) {
              console.error('Error fetching user role:', error);
              setRole(null);
            }
          } else {
            setSession(null);
            setRole(null);
            setStatus('unauthenticated');
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { status, session, role };
}
