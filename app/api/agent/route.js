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
    const conversationHistory = await getMemory(userId, agent);

    // Add user message to memory
    await setMemory(userId, agent, 'user', message);

    // Build messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-5',
      messages,
      // max_completion_tokens: 2000, // Increased token limit
      // Note: o1 models don't support temperature parameter
    });

    console.log('OpenAI completion response:', JSON.stringify(completion, null, 2));

    const assistantMessage = completion.choices[0]?.message?.content || '';

    // Handle empty responses specifically for o1 models
    if (!assistantMessage) {
      console.error('Empty response from OpenAI. Finish reason:', completion.choices[0]?.finish_reason);
      
      // For o1 models, try with a more direct prompt
      if (completion.choices[0]?.finish_reason === 'length') {
        // Retry with a simpler, more direct message
        const retryMessages = [
          { role: 'user', content: `Please provide a helpful response to: ${message}` }
        ];
        
        const retryCompletion = await openai.chat.completions.create({
          model: 'gpt-5',
          messages: retryMessages,
          max_completion_tokens: 1000,
        });
        
        const retryMessage = retryCompletion.choices[0]?.message?.content || 'I apologize, but I\'m having trouble generating a response right now. Please try rephrasing your question.';
        
        // Add retry response to memory
        await setMemory(userId, agent, 'assistant', retryMessage);
        
        return Response.json({
          agent,
          message: retryMessage,
          leadScore: scoreLead(retryMessage)
        });
      }
      
      return Response.json({ 
        error: 'AI model returned empty response', 
        debug: { finish_reason: completion.choices[0]?.finish_reason }
      }, { status: 500 });
    }

    // Add assistant response to memory
    await setMemory(userId, agent, 'assistant', assistantMessage);

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