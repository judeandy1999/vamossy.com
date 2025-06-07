'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signInWithGoogle, signInWithEmail, resetPassword } from '@/utils/authService';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';


export default function LoginPage() {
  const router = useRouter();
  const { status, role } = useAuthWithRedirect();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && role === 'admin') {
      redirect('/create-article');
    } else if (status === 'authenticated' && role !== 'admin') {
      redirect('/user-dashboard');
    }
  }, [status]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { error } = await signInWithEmail(email, password);

    if (error) {
      setError(error.message);
    } else {
      router.push('/create-article');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
  };

  if (status === 'loading') return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Brand<span className="text-yellow-400">Name</span>
        </h1>
        <p className="mb-6 text-gray-600">Log in to continue</p>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 rounded-sm border border-gray-300 shadow text-gray-600 px-4 py-2 hover:bg-gray-100 hover:scale-101 transition-colors w-full mb-4"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="my-4 text-gray-400 text-xs uppercase">Or</div>

        {/* Manual login */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition-colors"
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>
        <a
          href="/forgot-password"
          className="mt-2 text-xs text-blue-500 hover:underline"
        >
          Forgot password?
        </a>

        {/* Link to Sign Up */}
        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
