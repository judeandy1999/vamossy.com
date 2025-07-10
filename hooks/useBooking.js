import { useState, useCallback } from 'react';
import { supabase } from '@/utils/client';

export function useBooking() {
  const [userCredits, setUserCredits] = useState(0);
  const [scheduledBookings, setScheduledBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserCredits = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/users/credits', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch credits');
      }

      const data = await response.json();
      setUserCredits(data.credits);
      return data.credits;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch credits:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchScheduledBookings = useCallback(async (userEmail) => {
    if (!userEmail) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/calendly/scheduled-events?invitee_email=${userEmail}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch scheduled bookings');
      }

      const data = await response.json();
      const bookings = data.collection || [];
      setScheduledBookings(bookings);
      return bookings;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch scheduled bookings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async (userEmail) => {
    try {
      await Promise.all([
        fetchUserCredits(),
        fetchScheduledBookings(userEmail)
      ]);
    } catch (err) {
      console.error('Failed to refresh booking data:', err);
    }
  }, [fetchUserCredits, fetchScheduledBookings]);

  return {
    userCredits,
    scheduledBookings,
    loading,
    error,
    fetchUserCredits,
    fetchScheduledBookings,
    refreshData,
    setUserCredits,
    setScheduledBookings
  };
}