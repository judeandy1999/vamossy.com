'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signInWithGoogle, signInWithEmail, getUser } from '@/utils/authService';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useSendToHubSpot } from '@/hooks/useSendToHubSpot';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuthWithRedirect();
  const { sendToHubSpot, loading: hubSpotLoading, error: hubSpotError } = useSendToHubSpot();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/');
    }
  }, [status]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { error } = await signInWithEmail(email, password);

    if (error) {
      setError(error.message);
    } else {
      const { user, error: userError } = await getUser();
      if (user) {
        await sendToHubSpot(user);
        router.push('/');
      } else if (userError) {
        setError(userError.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  if (status === 'loading') return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Brand<span className="text-yellow-400">Name</span>
          </h1>
          <p className="text-gray-500 text-sm">Log in to continue</p>
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow transition transform hover:scale-105"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium text-gray-600">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase">
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
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />

          {(error || hubSpotError) && (
            <p className="text-xs text-red-500">{error || hubSpotError}</p>
          )}

          <button
            type="submit"
            disabled={loading || hubSpotLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full py-2 font-medium transition-colors"
          >
            {loading || hubSpotLoading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        <div className="flex justify-between text-xs text-gray-500">
          <Link href="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
          <span>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-yellow-400 hover:underline">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
