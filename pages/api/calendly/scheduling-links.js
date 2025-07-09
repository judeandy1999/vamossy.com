import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';
import { supabase } from '@/utils/client';

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
    // Check if user has available credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', user.id);

    if (creditsError) {
      throw creditsError;
    }

    const totalCredits = credits.reduce((sum, record) => sum + record.credits_remaining, 0);

    if (totalCredits < 1) {
      return res.status(400).json({ 
        error: 'Insufficient credits',
        canBook: false,
        creditsRemaining: totalCredits
      });
    }

    const { event_type_uri, max_event_count = 1 } = req.body;

    if (!event_type_uri) {
      return res.status(400).json({ error: 'Event type URI is required' });
    }

    // Create scheduling link
    const response = await fetch('https://api.calendly.com/scheduling_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner: event_type_uri,
        max_event_count,
        owner_type: 'EventType'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = 'Failed to create scheduling link';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorText
      });
    }

    const data = await response.json();
    
    return res.status(200).json({
      ...data,
      canBook: true,
      creditsRemaining: totalCredits
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to create scheduling link',
      details: error.message
    });
  }
}