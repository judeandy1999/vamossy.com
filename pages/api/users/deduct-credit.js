import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { booking_details, credits_used = 1 } = req.body;

    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .gt('credits_remaining', 0)
      .order('created_at', { ascending: true })
      .limit(1);

    if (creditsError) {
      throw creditsError;
    }

    if (!credits.length) {
      return res.status(400).json({ error: 'No available credits' });
    }

    const creditRecord = credits[0];

    const { data: updatedCredit, error: updateError } = await supabase
      .from('user_credits')
      .update({
        credits_used: creditRecord.credits_used + credits_used
      })
      .eq('id', creditRecord.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Get total remaining credits
    const { data: allCredits, error: totalError } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', user.id);

    if (totalError) {
      throw totalError;
    }

    const totalCredits = allCredits.reduce((sum, record) => sum + record.credits_remaining, 0);

    return res.status(200).json({
      success: true,
      remaining_credits: totalCredits,
      credit_record: updatedCredit
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to deduct credit',
      details: error.message 
    });
  }
}