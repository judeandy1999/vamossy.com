import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateUserPassword, verifyOtpToken } from '@/utils/authService';

export function useResetForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const email = searchParams.get('email');

  useEffect(() => {
    const verify = async () => {
      if (tokenHash && type === 'recovery' && email) {
        setLoading(true);
        const { error } = await verifyOtpToken({ email, token: tokenHash });
        console.log('OTP verification result:', error);
        if (error) setError(error.message);
        else setOtpVerified(true);
        setLoading(false);
      }
    };
    verify();
  }, [tokenHash, type, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    const { error } = await updateUserPassword(password);
    setLoading(false);
    if (error) setError(error.message);
    else {
      setMessage('Password reset successfully.');
      router.push('/login');
    }
  };

  return {
    password,
    confirmPassword,
    loading,
    message,
    error,
    otpVerified,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
}
