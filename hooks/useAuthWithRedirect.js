import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/client';

export function useAuthWithRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setSession(session);
        setStatus('authenticated');

        // Fetch role from your users table
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setRole(userData ? userData.role : null);

      } else {
        setSession(null);
        setRole(null);
        setStatus('unauthenticated');
      }
    };

    checkSession();

    // Fix: wrap await logic in async IIFE
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session) {
          setSession(session);
          setStatus('authenticated');

          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          setRole(userData ? userData.role : null);

        } else {
          setSession(null);
          setRole(null);
          setStatus('unauthenticated');
        }
      })();
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [router]);

  return { status, session, role };
}
