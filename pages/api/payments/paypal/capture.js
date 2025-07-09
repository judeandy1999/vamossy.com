import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  const { orderID } = req.body;

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

    // TODO: Save payment record to database
    // You can add this later when you set up your payments table
    
    res.status(200).json({
      success: true,
      data: captureData,
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Payment processing failed' 
    });
  }
}