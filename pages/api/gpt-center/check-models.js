// pages/api/gpt-center/check-models.js
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
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ 
        available: false, 
        message: 'No OpenAI API key configured' 
      });
    }

    // Check available models
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();
    const chatModels = data.data.filter(model => 
      model.id.includes('gpt') || model.id.includes('chat')
    ).map(model => model.id);

    return res.status(200).json({
      available: true,
      models: chatModels,
      recommended: chatModels.find(m => m.includes('gpt-4o-mini')) || 
                   chatModels.find(m => m.includes('gpt-3.5')) ||
                   chatModels[0]
    });

  } catch (error) {
    console.error('Model check error:', error);
    return res.status(500).json({ 
      error: 'Failed to check models',
      details: error.message 
    });
  }
}