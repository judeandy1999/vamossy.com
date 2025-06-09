'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';
import Spinner from '@/components/ui/spinner';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyOtp = async () => {
      if (tokenHash && type === 'recovery' && email) {
        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: tokenHash,
          type,
        });
        setLoading(false);

        if (error) {
          console.error('OTP verification error:', error.message);
          setError(error.message || 'Invalid or expired token.');
        } else {
          setOtpVerified(true);
        }
      } else {
        setError('Missing required parameters.');
      }
    };
    verifyOtp();
  }, [tokenHash, type, email]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('✅ Password successfully updated! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    if (password.length < minLength) return 'Password must be at least 8 characters.';
    if (!hasNumber) return 'Password must contain at least one number.';
    if (!hasSpecialChar) return 'Password must contain at least one special character.';
    if (!hasUppercase) return 'Password must contain at least one uppercase letter.';
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Reset <span className="text-yellow-400">Password</span></h1>
        <p className="text-gray-500 text-sm">Enter your new password below</p>

        {message ? (
          <p className="text-green-600 text-sm">{message}</p>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4 text-left">
            {!otpVerified && (
              <p className="text-yellow-500 text-sm">Verifying OTP...</p>
            )}
            {otpVerified && (
              <>
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
              </>
            )}

            {error && (
              <p className="text-xs text-red-500 transition-opacity duration-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full py-2 font-medium transition-colors"
            >
              {loading ? <Spinner size="small" /> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
