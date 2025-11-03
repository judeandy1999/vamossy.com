// app/api/agent/route.js
import { readFileSync } from 'fs';
import { join } from 'path';
import { openai } from '@/lib/openai';
import { getMemory, setMemory } from '@/lib/memory';
import { scoreLead, logEvent } from '@/lib/telemetry';

export async function POST(request) {
  try {
    const { agent, userId, sessionId, message } = await request.json();

    // Validate inputs
    const validAgents = ['acquisition', 'seo', 'conversion', 'retention', 'analytics', 'creative', 'foresight'];
    if (!validAgents.includes(agent)) {
      return Response.json({ error: 'Invalid agent' }, { status: 400 });
    }

    if (!message || !userId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Read unified prompt
    const promptPath = join(process.cwd(), 'agents', 'vamossy_unified.txt');
    const unifiedPrompt = readFileSync(promptPath, 'utf-8');
    
    // Replace placeholder with active agent
    const systemPrompt = unifiedPrompt.replace(/<ACTIVE_AGENT>/g, agent);

    // Get conversation memory
    const conversationHistory = getMemory(userId, agent, 6);

    // Add user message to memory
    setMemory(userId, agent, 'user', message);

    // Build messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const assistantMessage = completion.choices[0].message.content;

    // Add assistant response to memory
    setMemory(userId, agent, 'assistant', assistantMessage);

    // Score lead potential
    const leadScore = scoreLead(assistantMessage);

    // Log the interaction
    await logEvent({
      userId,
      sessionId,
      agent,
      input: message,
      output: assistantMessage,
      leadScore,
      version: 'Vamossy-Agents-1.0.0'
    });

    return Response.json({
      agent,
      message: assistantMessage,
      leadScore
    });

  } catch (error) {
    console.error('Agent API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}