export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid JSON format' });
    }
  }

  const { name, email, domain, message } = body || {};

  // Validation
  if (!name || !email || !domain || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: name, email, domain, and message are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format' 
    });
  }

  // Validate domain format
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid domain format' 
    });
  }

  try {
    // Log the submission for debugging
    const submissionData = {
      name,
      email,
      domain,
      message,
      form_type: 'opportunities_review',
      submitted_at: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    };

    // Check if Web3Forms API key is configured
    const web3formsApiKey = process.env.WEB3FORMS_API_KEY;
    if (!web3formsApiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Web3Forms API key not configured' 
      });
    }

    // Prepare the payload for Web3Forms
    const web3formsPayload = {
      access_key: web3formsApiKey,
      name: name,
      email: email,
      message: `Domain: ${domain}\n\nMessage: ${message}`,
      subject: `New Opportunities Review Request from ${name}`,
      from_name: "Vamossy Website"
    };

    // Send to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(web3formsPayload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ 
        success: false, 
        error: `Web3Forms HTTP error: ${response.status}`,
        details: result
      });
    }

    if (!result.success) {
      console.error('Web3Forms API Error:', result);
      return res.status(500).json({ 
        success: false, 
        error: 'Web3Forms rejected the submission',
        details: result
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Opportunities review request submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message
    });
  }
}
