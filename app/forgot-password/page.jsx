'use client';

import { useState } from 'react';
import { resetPassword } from '@/utils/authService';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Forgot <span className="text-yellow-400">Password</span>
        </h1>
        <p className="mb-6 text-gray-600">Enter your email to reset your password</p>

        <form onSubmit={handleForgotPassword} className="flex flex-col gap-3 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-500 text-xs">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? <Spinner size="small" /> : 'Send Reset Email'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Remembered your password?{' '}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}