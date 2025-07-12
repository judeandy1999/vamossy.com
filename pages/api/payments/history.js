import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';
import { getUserRole } from '@/utils/getUserRole';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userRole = await getUserRole(user.email);

    let query = supabase
      .from('payment_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (userRole !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    const { data: paymentData, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    const payments = await Promise.all(
      (paymentData || []).map(async (payment) => {
        if (payment.user_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, name, email')
              .eq('id', payment.user_id)
              .single();

            if (userError) {
              console.error('Error fetching user for payment:', payment.id, userError);
              return {
                ...payment,
                users: null
              };
            }

            return {
              ...payment,
              users: userData
            };
          } catch (err) {
            console.error('Error in user fetch:', err);
            return {
              ...payment,
              users: null
            };
          }
        }
        return payment;
      })
    );

    return res.status(200).json({ 
      payments: payments || [],
      userRole
    });

  } catch (error) {
    console.error('Payment history fetch error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch payment history',
      details: error.message 
    });
  }
}