import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {  
  if (!authenticate(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let executionId = null;

  try {
    const { user, error: authError } = await verifySupabaseAuth(req);
    if (authError) {
      return res.status(401).json({ error: authError });
    }

    const { taskId, description, gptUrl } = req.body;

    if (!taskId || !description) {
      return res.status(400).json({ error: 'Missing required fields: taskId and description' });
    }

    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!taskData) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (taskData.assigned_user_id !== user.id) {
      return res.status(403).json({ error: 'Not authorized to execute this task' });
    }

    const { data: execution, error: execError } = await supabase
      .from('task_executions')
      .insert({
        task_id: taskId,
        user_id: user.id,
        triggered_at: new Date().toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (execError) {
      console.error('Execution creation error:', execError);
      throw execError;
    }

    executionId = execution.id;

    let gptResponse;
    let tokensUsed = 0;
    let modelUsed = 'mock';
    const model = 'gpt-4o-2024-11-20'

    let apiSuccess = false;

    try {
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides clear, actionable task instructions for work assignments.'
            },
            {
              role: 'user',
              content: `Task: ${description}\n\nGPT Project URL: ${gptUrl || 'None provided'}\n\nProvide detailed, step-by-step instructions for completing this task effectively.`
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (openAIResponse.ok) {
        const openAIData = await openAIResponse.json();
        gptResponse = openAIData.choices[0]?.message?.content;
        tokensUsed = openAIData.usage?.total_tokens || 0;
        modelUsed = model;
        apiSuccess = true;
      } else {
        const errorData = await openAIResponse.json().catch(() => ({}));
      }
    } catch (modelError) {
      console.log(`Error with model ${model}:`, modelError.message);
    }

    const { error: updateError } = await supabase
      .from('task_executions')
      .update({
        gpt_response: { 
          content: gptResponse,
          tokens_used: tokensUsed,
          model: modelUsed
        },
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', executionId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Update execution error:', updateError);
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      response: gptResponse,
      executionId: executionId,
      model: modelUsed,
      isRealGPT: modelUsed !== 'mock' && modelUsed !== 'enhanced-mock'
    });

  } catch (error) {
    if (executionId) {
      try {
        await supabase
          .from('task_executions')
          .update({ 
            status: 'failed',
            gpt_response: { error: error.message },
            completed_at: new Date().toISOString()
          })
          .eq('id', executionId);
      } catch (updateError) {
        console.error('Failed to update execution status:', updateError);
      }
    }
    
    return res.status(500).json({ 
      error: 'Failed to execute task',
      details: error.message 
    });
  }
}
