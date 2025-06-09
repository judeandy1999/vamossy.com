'use client';

import { useState } from 'react';
import { resetPassword } from '@/utils/authService';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';

export default function ForgotPasswordPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Forgot <span className="text-yellow-400">Password</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your email to reset your password
        </p>

        {message ? (
          <div className="flex flex-col gap-3 items-center">
            <p className="text-green-600 text-sm">{message}</p>
            <a
              href="/login"
              className="inline-block mt-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full py-2 px-4 font-medium transition-colors"
            >
              Back to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />

            {error && (
              <p className="text-xs text-red-500 transition-opacity duration-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full py-2 font-medium transition-colors"
            >
              {loading ? <Spinner size="small" /> : 'Send Reset Email'}
            </button>
          </form>
        )}

        {!message && (
          <p className="text-center text-sm text-gray-600">
            Remembered your password?{' '}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
