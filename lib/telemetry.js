// lib/telemetry.js
import { supabase } from '@/utils/client';

export function scoreLead(output) {
  let score = 0;
  
  // High-intent keywords (2 points each)
  const highIntentKeywords = [
    'pricing', 'budget', 'timeline', 'integration', 
    'pilot', 'poc', 'sow', 'proposal', 'quote'
  ];
  
  // Very high-intent phrases (3 points each)
  const veryHighIntentPhrases = [
    'book a call', 'ready to', 'start', 'schedule', 
    'when can we begin', 'let\'s discuss', 'interested in moving forward'
  ];
  
  const lowerOutput = output.toLowerCase();
  
  // Score high-intent keywords
  highIntentKeywords.forEach(keyword => {
    if (lowerOutput.includes(keyword)) {
      score += 2;
    }
  });
  
  // Score very high-intent phrases
  veryHighIntentPhrases.forEach(phrase => {
    if (lowerOutput.includes(phrase)) {
      score += 3;
    }
  });
  
  return Math.min(score, 10); // Cap at 10
}

export async function logEvent({ userId, sessionId, agent, input, output, leadScore, version }) {
  try {
    const { error } = await supabase
      .from('agent_logs')
      .insert({
        user_id: userId,
        session_id: sessionId,
        agent,
        input,
        output,
        lead_score: leadScore,
        version,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Failed to log agent interaction:', error);
    }
  } catch (err) {
    console.error('Error logging to database:', err);
  }
}