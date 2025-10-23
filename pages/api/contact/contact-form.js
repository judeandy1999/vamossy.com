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

  const { name, email, company, serviceType, message } = body || {};

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format' 
    });
  }

  try {
    // Log the submission for debugging
    const submissionData = {
      name,
      email,
      company: company || 'Not provided',
      serviceType: serviceType || 'Not specified',
      message,
      form_type: 'contact_form',
      submitted_at: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    };

    console.log('Contact Form Submission:', JSON.stringify(submissionData, null, 2));

    // Check if Web3Forms API key is configured
    const web3formsApiKey = process.env.WEB3FORMS_API_KEY;
    if (!web3formsApiKey) {
      console.error('Web3Forms API key not found in environment variables');
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
      message: `Company: ${company || 'Not provided'}
Service Type: ${serviceType || 'Not specified'}

Message: ${message}`,
      subject: `New Contact Form Submission from ${name}`,
      from_name: "Vamossy Website"
    };

    console.log('Sending to Web3Forms:', JSON.stringify(web3formsPayload, null, 2));

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
    
    console.log('Web3Forms Response Status:', response.status);
    console.log('Web3Forms Response:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      console.error('Web3Forms HTTP Error:', response.status, response.statusText);
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

    console.log('Contact form submitted successfully to Web3Forms');
    return res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message
    });
  }
}