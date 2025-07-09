import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  if (req.method === 'GET') {
    try {
      const { data: credits, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalCredits = credits.reduce((sum, record) => sum + record.credits_remaining, 0);
      
      const { data: bookings, error: bookingError } = await supabase
        .from('consultation_bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (bookingError) throw bookingError;

      return res.status(200).json({ 
        credits: totalCredits,
        creditHistory: credits,
        bookingHistory: bookings || []
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch credits' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { credits_purchased, payment_id } = req.body;

      if (!credits_purchased || !payment_id) {
        return res.status(400).json({ error: 'Credits and payment ID required' });
      }

      const { data, error } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          credits_purchased,
          credits_remaining: credits_purchased,
          credits_used: 0,
          payment_id
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to add credits' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}