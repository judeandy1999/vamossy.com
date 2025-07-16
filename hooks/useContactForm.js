import { useState } from 'react';

export function useContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setError(null);
    setSuccess(false);
  };

  const submitContactForm = async ({ name, email, message }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/contact/contact-klaviyo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to submit form');
        setSuccess(false);
        return { success: false, error: data.error || 'Failed to submit form' };
      }
      setSuccess(true);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Network error');
      setSuccess(false);
      return { success: false, error: err.message || 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  return { submitContactForm, loading, error, success, resetForm };
}
