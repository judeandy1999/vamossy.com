import { useState } from 'react';

export const useSendToKlaviyo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendToKlaviyo = async (user) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-to-klaviyo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          firstName: user.user_metadata.first_name || user.user_metadata.name || 'No Name',
          lastName: user.user_metadata.last_name || '',
        }),
      });

      const responseText = await response.text();
      console.log('Klaviyo response:', responseText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send data to Klaviyo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendToKlaviyo, loading, error };
};
