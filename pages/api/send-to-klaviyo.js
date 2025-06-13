export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, firstName, lastName } = req.body;

  try {
    // Step 1: Create profile
    const profileRes = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
        revision: '2023-10-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email,
            first_name: firstName,
            last_name: lastName,
          },
        },
      }),
    });

    const profileData = await profileRes.json();

    if (!profileRes.ok) {
      throw new Error(profileData.errors?.[0]?.detail || 'Failed to create Klaviyo profile');
    }

    const klaviyoProfileId = profileData.data.id;

    // Step 2: Add profile to list
    const listRes = await fetch('https://a.klaviyo.com/api/lists/S6dA23/relationships/profiles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
        revision: '2023-10-15',
      },
      body: JSON.stringify({
        data: [
          {
            type: 'profile',
            id: klaviyoProfileId, // <-- this must be the Klaviyo profile ID
          },
        ],
      }),
    });

    const listText = await listRes.text();
    const listData = listText ? JSON.parse(listText) : {};

    if (!listRes.ok) {
      throw new Error(listData.errors?.[0]?.detail || 'Failed to add profile to list');
    }

    if (!listRes.ok) {
      throw new Error(listData.errors?.[0]?.detail || 'Failed to add profile to list');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Klaviyo Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
