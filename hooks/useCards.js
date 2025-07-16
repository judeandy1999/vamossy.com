import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';

export function useCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);

  // Update ref when showToast changes
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accessToken = await getAccessToken();
      
      const response = await fetch('/api/cards', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cards');
      }

      setCards(data.cards || []);
      setUserRole(data.userRole);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err.message);
      showToastRef.current('Failed to fetch cards', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCard = useCallback(async (cardData) => {
    try {
      setSubmitting(true);
      setError(null);

      const accessToken = await getAccessToken();

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create card');
      }

      // Optimistic update - add the new card to the beginning of the list
      setCards(prevCards => [data.card, ...prevCards]);
      
      showToastRef.current(data.message || 'Card created successfully', 'success');
      return data.card;
    } catch (err) {
      console.error('Error creating card:', err);
      setError(err.message);
      showToastRef.current('Failed to create card', 'error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateCard = useCallback(async (id, cardData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Optimistic update - update the card in the list immediately
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === id 
            ? { ...card, ...cardData, updated_at: new Date().toISOString() }
            : card
        )
      );

      const accessToken = await getAccessToken();

      const response = await fetch('/api/cards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({ id, ...cardData }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update on error
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === id 
              ? { ...card, ...cardData }
              : card
          )
        );
        throw new Error(data.error || 'Failed to update card');
      }

      // Update with the actual server response
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === id ? data.card : card
        )
      );

      showToastRef.current(data.message || 'Card updated successfully', 'success');
      return data.card;
    } catch (err) {
      console.error('Error updating card:', err);
      setError(err.message);
      showToastRef.current('Failed to update card', 'error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deleteCard = useCallback(async (id) => {
    try {
      setError(null);

      // Store the card to restore if deletion fails
      const cardToDelete = cards.find(card => card.id === id);
      
      // Optimistic update - remove the card from the list immediately
      setCards(prevCards => prevCards.filter(card => card.id !== id));

      const accessToken = await getAccessToken();

      const response = await fetch('/api/cards', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update on error - restore the card
        if (cardToDelete) {
          setCards(prevCards => {
            const newCards = [...prevCards];
            const originalIndex = cards.findIndex(card => card.id === id);
            newCards.splice(originalIndex, 0, cardToDelete);
            return newCards;
          });
        }
        throw new Error(data.error || 'Failed to delete card');
      }

      showToastRef.current(data.message || 'Card deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting card:', err);
      setError(err.message);
      showToastRef.current('Failed to delete card', 'error');
      throw err;
    }
  }, [cards]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    loading,
    submitting,
    error,
    userRole,
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
  };
}