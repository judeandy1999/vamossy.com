import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';
import { supabase } from '@/utils/client';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  const { orderID, credits_purchased, amount, description } = req.body;

  if (!orderID) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const authString = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`PayPal token error: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
    }

    const captureResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
          'Prefer': 'return=representation',
        },
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      throw new Error(captureData.message || captureData.details?.[0]?.description || 'Payment capture failed');
    }

    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payment_records')
      .insert({
        user_id: user.id,
        paypal_order_id: orderID,
        amount,
        description,
        status: 'completed',
        credits_purchased: credits_purchased || 1
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    const { data: existing, error: fetchError } = await supabase
      .from('user_credits')
      .select('credits_purchased, credits_used')
      .eq('user_id', user.id)
      .single();

    const creditsToAdd = credits_purchased || 1;

    const updatedCreditsPurchased = (existing?.credits_purchased || 0) + creditsToAdd;
    const updatedCreditsUsed = existing?.credits_used || 0;

    // Use upsert to either update existing record or create new one
    const { data: creditsData, error: upsertError } = await supabase
      .from('user_credits')
      .upsert({
        user_id: user.id,
        credits_purchased: updatedCreditsPurchased,
        credits_used: updatedCreditsUsed
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (upsertError) {
      throw upsertError;
    }

    res.status(200).json({
      success: true,
      data: captureData,
      credits_added: credits_purchased || 1,
      payment_id: paymentRecord.id
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Payment processing failed' 
    });
  }
}