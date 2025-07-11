// pages/api/contact/contact-klaviyo.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let body = req.body;

  // If body is a string (sometimes happens in misconfigured requests), parse it
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid JSON format' });
    }
  }

  const { name, email, message } = body || {};

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Environment key
  const klaviyoApiKey = process.env.KLAVIYO_API_KEY || process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!klaviyoApiKey) {
    return res.status(500).json({ success: false, error: 'Klaviyo API key not configured' });
  }

  const eventPayload = {
    data: {
      type: 'event',
      attributes: {
        metric: {
          data: {
            type: 'metric',
            attributes: {
              name: 'Contact Form Submitted'
            }
          }
        },
        profile: {
          data: {
            type: 'profile',
            attributes: {
              email: email
            }
          }
        },
        properties: {
          name,
          email,
          message
        },
      }
    }
  };

  try {
    const response = await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${klaviyoApiKey}`,
        'Accept': 'application/json',
        'revision': '2023-10-15',
      },
      body: JSON.stringify(eventPayload),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
}
