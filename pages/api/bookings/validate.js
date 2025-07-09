import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  if (req.method === 'POST') {
    try {
      const { calendly_event_id, booking_date } = req.body;

      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', user.id);

      if (creditsError) throw creditsError;

      const totalCredits = credits.reduce((sum, record) => sum + record.credits_remaining, 0);

      if (totalCredits < 1) {
        return res.status(400).json({ 
          error: 'Insufficient credits',
          canBook: false,
          creditsRemaining: totalCredits
        });
      }

      const { data: booking, error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert({
          user_id: user.id,
          calendly_event_id,
          booking_date,
          credits_used: 1
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ 
          credits_used: supabase.sql`credits_used + 1`
        })
        .eq('user_id', user.id)
        .eq('credits_remaining', supabase.sql`credits_remaining > 0`)
        .limit(1);

      if (updateError) throw updateError;

      return res.status(200).json({ 
        success: true,
        booking,
        canBook: true,
        creditsRemaining: totalCredits - 1
      });
    } catch (error) {
      return res.status(500).json({ error: 'Booking validation failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}