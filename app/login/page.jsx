'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';
import { signInWithGoogle, signInWithEmail } from '@/utils/authService';
import { useAuth } from '@/contexts/auth-context';
// import { useSendToKlaviyo } from '@/hooks/useSendToKlaviyo';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { status, session, isInitialized } = useAuth();
  // const { sendToKlaviyo, loading: klaviyoLoading, error: klaviyoError } = useSendToKlaviyo();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isInitialized && status === 'authenticated' && session) {
      router.replace('/user-dashboard');
    }
  }, [status, session, isInitialized, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const { data, error: signInError } = await signInWithEmail(email, password);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // if (data?.user) {
      //   try {
      //     await sendToKlaviyo(data.user);
      //   } catch (klaviyoErr) {
      //     console.warn('[LoginPage] Klaviyo error:', klaviyoErr);
      //   }
      // }
      
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

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  if (!isInitialized || status === 'loading' || status === 'authenticated') {
    return (
      <Spinner />
    );
  }

  if (status !== 'unauthenticated') {
    return (
      <Spinner />
    );
  }

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
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium text-gray-700">
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </span>
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
            disabled={loading}
            className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {(error || klaviyoError) && (
            <p className="text-xs text-red-500 text-center">{error || klaviyoError}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="bg-[#f4c30f] hover:bg-yellow-500 text-gray-900 rounded-full py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
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
