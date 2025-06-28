'use client';

import { useResetForm } from '@/hooks/useResetForm';
import Spinner from '@/components/ui/spinner';

export default function ResetPasswordForm() {
  const {
    password, confirmPassword, loading, message, error, otpVerified,
    setPassword, setConfirmPassword, handleSubmit
  } = useResetForm();

  if (!otpVerified) return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Reset <span className="text-yellow-400">Password</span></h1>
        <p className="text-gray-500 text-sm">Enter your new password below</p>

        {message ? (
          <p className="text-green-600 text-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-300 rounded-full py-2 font-medium transition-colors"
            >
              {loading ? <Spinner size="small" /> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
