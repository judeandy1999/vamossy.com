'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';
import { signInWithGoogle, signInWithEmail } from '@/utils/authService';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { status, session, isInitialized } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isInitialized && status === 'authenticated' && session) {
      setRedirecting(true);
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

      if (data?.user) {
        console.log('Email login successful:', data.user.email);
        // The useAuth hook will handle the redirect
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

    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // For OAuth, the redirect happens automatically
        // Don't set loading to false here as we're redirecting
        console.log('Google login initiated');
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  if (!isInitialized || redirecting) {
    return <Spinner />;
  }

  if (status === 'loading') {
    return <Spinner />;
  }

  if (status === 'authenticated') {
    return <Spinner />;
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-[#f3f6f9] to-[#f1f6fe] flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-2">
          <div className='flex flex-col items-center mb-4'>
            <span className="p-1 font-semibold text-5xl bg-gradient-to-r from-[#032646] to-[#60a5fa] bg-clip-text text-transparent">
              Vamossy
            </span>
            <span className="text-[#032646] text-lg font-medium -mt-4">
              vamossy.com
            </span>
          </div>
          <h1 className="mt-10 text-2xl font-bold text-[#1e283c]">
            Welcome Back
          </h1>
          <p className="text-[#505a66] text-sm">Sign in to your account to continue</p>
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-lg py-3 px-4 text-[#1e283c] font-medium hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <FcGoogle size={20} />
          <span className="text-sm">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 text-[#505a66] text-sm mb-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span>or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f40af] focus:border-transparent bg-gray-50 text-[#1e283c] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f40af] focus:border-transparent bg-gray-50 text-[#1e283c] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="cursor-pointer w-full bg-[#1f40af] hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <Link 
              href="/forgot-password" 
              className="text-[#1f40af] hover:text-blue-800 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
            <div className="text-[#505a66]">
              Don&apos;t have an account?{' '}
              <Link 
                href="/signup" 
                className="text-[#1f40af] hover:text-blue-800 hover:underline transition-colors font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
