import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

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
    if (!process.env.CALENDLY_API_TOKEN) {
      return res.status(500).json({ error: 'Calendly API token not configured' });
    }

    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      return res.status(userResponse.status).json({ 
        error: 'Failed to fetch user info',
        details: errorText
      });
    }

    const userData = await userResponse.json();
    const userUri = userData.resource.uri;
    
    const response = await fetch(`https://api.calendly.com/event_types?user=${userUri}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = 'Failed to fetch event types';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch event types',
      details: error.message 
    });
  }
}