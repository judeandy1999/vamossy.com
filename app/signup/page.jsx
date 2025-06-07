'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Automatically fade out error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
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

    // Check if user already exists
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

    // Sign up
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone_number: `${countryCode}${phoneNumber}`,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccessMessage('Check your email for a confirmation link!');
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
  
    if (password.length < minLength) return 'Password must be at least 6 characters.';
    if (!hasNumber) return 'Password must contain at least one number.';
    if (!hasSpecialChar) return 'Password must contain at least one special character.';
    if (!hasUppercase) return 'Password must contain at least one uppercase letter.';
    return null;
  };
  

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Enter your email to resend the confirmation link.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    setLoading(false);

    if (error) {
      setError(error.message || 'Failed to resend confirmation link.');
    } else {
      setSuccessMessage('Confirmation link resent! Check your email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Create an <span className="text-yellow-400">Account</span>
        </h1>

        <form onSubmit={handleSignUp} className="flex flex-col gap-3 text-left">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
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
          <p className="text-xs text-gray-500 -mt-2 mb-2">
            Password must be at least 8 characters.
          </p>
          <input
            type="password"
            placeholder="Repeat Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {error && <p className="text-red-500 text-xs transition-opacity duration-500">{error}</p>}
          {successMessage && <p className="text-green-500 text-xs">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition-colors"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        {/* Resend confirmation link */}
        {successMessage && (
          <button
            onClick={handleResendConfirmation}
            disabled={loading}
            className="mt-2 text-xs text-blue-500 hover:underline"
          >
            Resend confirmation link
          </button>
        )}

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
