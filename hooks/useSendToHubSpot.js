import { useState } from 'react';

export const useSendToHubSpot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendToHubSpot = async (user) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-to-hubspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          firstName: user.user_metadata.first_name || user.user_metadata.name || 'No Name',
          lastName: user.user_metadata.last_name || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send data to HubSpot');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendToHubSpot, loading, error };
};