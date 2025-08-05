'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';
import { signInWithGoogle, signInWithEmail, getUser } from '@/utils/authService';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useSendToKlaviyo } from '@/hooks/useSendToKlaviyo';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { status, session, isInitialized } = useAuthWithRedirect();
  const { sendToKlaviyo, loading: klaviyoLoading, error: klaviyoError } = useSendToKlaviyo();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRedirected, setHasRedirected] = useState(false);

  // Add logging for auth state changes
  useEffect(() => {
    console.log('[LoginPage] Auth state changed:', {
      status,
      hasSession: !!session,
      isInitialized,
      hasRedirected,
      pathname: window.location.pathname
    });
  }, [status, session, isInitialized, hasRedirected]);

  useEffect(() => {
    // Only redirect if we're fully initialized and authenticated
    if (isInitialized && status === 'authenticated' && session && !hasRedirected) {
      console.log('[LoginPage] Conditions met for redirect:', {
        isInitialized,
        status,
        hasSession: !!session,
        hasRedirected
      });
      setHasRedirected(true);
      console.log('[LoginPage] Redirecting to /user-dashboard');
      router.replace('/user-dashboard');
    }
  }, [status, session, isInitialized, hasRedirected, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('[LoginPage] Starting email login for:', email);

    try {
      const { error: signInError } = await signInWithEmail(email, password);
      
      console.log('[LoginPage] Email login result:', {
        hasError: !!signInError,
        errorMessage: signInError?.message
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const { user, error: userError } = await getUser();
      console.log('[LoginPage] getUser result:', {
        hasUser: !!user,
        userError: userError?.message
      });
      
      if (user && !userError) {
        console.log('[LoginPage] Sending user to Klaviyo');
        await sendToKlaviyo(user);
        // Don't manually redirect here, let the useEffect handle it
      } else if (userError) {
        setError(userError.message);
      }
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    console.log('[LoginPage] Starting Google login');

    try {
      const { error } = await signInWithGoogle();
      console.log('[LoginPage] Google login result:', {
        hasError: !!error,
        errorMessage: error?.message
      });
      
      if (error) {
        setError(error.message);
      }
      // Don't manually redirect here, let the useEffect handle it
    } catch (err) {
      console.error('[LoginPage] Google login error:', err);
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication status
  console.log('[LoginPage] Render decision:', {
    isInitialized,
    status,
    hasRedirected,
    shouldShowSpinner: !isInitialized || (status === 'authenticated' && !hasRedirected) || status !== 'unauthenticated'
  });

  if (!isInitialized || (status === 'authenticated' && !hasRedirected)) {
    console.log('[LoginPage] Showing spinner - not initialized or authenticated without redirect');
    return <Spinner />;
  }

  // Only show login form if definitely unauthenticated
  if status !== 'unauthenticated') {
    console.log('[LoginPage] Showing spinner - status is not unauthenticated:', status);
    return <Spinner />;
  }

  console.log('[LoginPage] Rendering login form');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-4">
      <div className="bg-[#262626]/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center mb-4">
            <Image src="/homepage/logo.png" alt="Logo" width={200} height={50} className="h-12 lg:h-14 w-auto" />
          </h1>
          <p className="text-gray-100 text-sm">Log in to continue</p>
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading || klaviyoLoading}
          className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow transition transform hover:scale-105 disabled:opacity-50"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-100 text-xs uppercase">
          <span className="flex-1 border-t"></span> or <span className="flex-1 border-t"></span>
        </div>

        {/* Manual Login */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />

          {(error || klaviyoError) && (
            <p className="text-xs text-red-500">{error || klaviyoError}</p>
          )}

          <button
            type="submit"
            disabled={loading || klaviyoLoading}
            className="bg-[#f4c30f] hover:bg-yellow-500 text-gray-100 rounded-full py-2 font-medium transition-colors disabled:opacity-50"
          >
            {loading || klaviyoLoading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        <div className="flex justify-between text-xs text-gray-100">
          <Link href="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
          <span>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#f4c30f] hover:underline">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
