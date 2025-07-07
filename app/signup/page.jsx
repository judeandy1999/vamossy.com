'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      setError('This email is already registered. Please log in instead.');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccessMessage('Success! Check your email for a confirmation link.');
      setResendCooldown(120);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Enter your email to resend the confirmation link.');
      return;
    }
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setLoading(false);

    if (error) {
      setError(error.message || 'Failed to resend confirmation link.');
    } else {
      setResendCooldown(120);
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
      <div className="bg-[#262626]/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-100">
          Create an <span className="text-[#f4c30f]">Account</span>
        </h1>

        {successMessage ? (
          <div className="flex flex-col gap-4 items-center">
            <p className="text-green-400 text-sm">{successMessage}</p>
            <p className="text-gray-100 text-xs">Please check your inbox and confirm your email.</p>
            <button
              onClick={handleResendConfirmation}
              disabled={loading || resendCooldown > 0}
              className={`mt-2 text-xs ${
                resendCooldown > 0 ? 'text-gray-400' : 'text-[#f4c30f] hover:underline'
              }`}
            >
              {resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : 'Resend confirmation link'}
            </button>
            <a
              href="/login"
              className="mt-2 inline-block bg-[#f4c30f] hover:bg-yellow-500 text-gray-300 rounded-full py-2 px-4 font-medium transition-colors"
            >
              Go to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f4c30f] text-sm"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f4c30f] text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f4c30f] text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f4c30f] text-sm"
            />
            <p className="text-xs text-gray-100 -mt-2 mb-2">Password must be at least 8 characters.</p>
            <input
              type="password"
              placeholder="Repeat Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="text-white px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f4c30f] text-sm"
            />

            {error && <p className="text-xs text-red-500 transition-opacity duration-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#f4c30f] hover:bg-yellow-500 text-gray-100 rounded-full py-2 font-medium transition-colors"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        )}

        {!successMessage && (
          <p className="text-center text-sm text-gray-100">
            Already have an account?{' '}
            <a href="/login" className="text-[#f4c30f] hover:underline">
              Log in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
