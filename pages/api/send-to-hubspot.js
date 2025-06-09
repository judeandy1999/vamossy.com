export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstName, lastName } = req.body;

    try {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        },
        body: JSON.stringify({
          properties: {
            email: email,
            firstname: firstName,
            lastname: lastName,
          },
        }),
      });

      const data = await response.json();
      console.log('HubSpot API response:', data);

      res.status(200).json({ success: true, hubspotData: data });
    } catch (error) {
      console.error('Error sending to HubSpot:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).end(); // Only allow POST
  }
}
