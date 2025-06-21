import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  console.log('Execute task API called:', req.method);
  
  if (!authenticate(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let executionId = null;

  try {
    // Verify user authentication
    const { user, error: authError } = await verifySupabaseAuth(req);
    if (authError) {
      console.error('Auth error:', authError);
      return res.status(401).json({ error: authError });
    }

    console.log('User authenticated:', user.id);

    const { taskId, description, gptUrl } = req.body;
    console.log('Request body:', { taskId, description, gptUrl });

    if (!taskId || !description) {
      return res.status(400).json({ error: 'Missing required fields: taskId and description' });
    }

    // Verify the task exists and belongs to this user
    console.log('Fetching task with ID:', taskId);
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError) {
      console.error('Task fetch error:', taskError);
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!taskData) {
      console.error('No task data returned');
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('Task found:', taskData);

    // Check if user can execute this task
    if (taskData.assigned_user_id !== user.id) {
      console.error('User not authorized for task:', taskData.assigned_user_id, 'vs', user.id);
      return res.status(403).json({ error: 'Not authorized to execute this task' });
    }

    // Create task execution record
    console.log('Creating task execution record');
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
    console.log('Execution created:', executionId);

    // Generate response (try multiple models in order of availability)
    let gptResponse;
    let tokensUsed = 0;
    let modelUsed = 'mock';

    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key - using mock response');
      gptResponse = generateMockResponse(description, gptUrl);
      tokensUsed = 150;
    } else {
      // Try models in order of likelihood to work
      const modelsToTry = ['gpt-4o-2024-11-20', 'chatgpt-4o-latest', 'gpt-4o-2024-08-06'];

      let apiSuccess = false;
      
      for (const model of modelsToTry) {
        try {
          console.log(`Trying model: ${model}`);
          
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
            console.log(`Success with model: ${model}`);
            break; // Success, exit the loop
          } else {
            const errorData = await openAIResponse.json().catch(() => ({}));
            console.log(`Model ${model} failed:`, errorData.error?.message);
            continue; // Try next model
          }
        } catch (modelError) {
          console.log(`Error with model ${model}:`, modelError.message);
          continue; // Try next model
        }
      }

      // If all models failed, use mock response
      if (!apiSuccess) {
        console.log('All OpenAI models failed, using enhanced mock response');
        gptResponse = generateMockResponse(description, gptUrl);
        tokensUsed = 150;
        modelUsed = 'enhanced-mock';
      }
    }

    // Update task execution with response
    console.log('Updating execution with response');
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

    console.log(`Task execution completed successfully with model: ${modelUsed}`);
    return res.status(200).json({
      success: true,
      response: gptResponse,
      executionId: executionId,
      model: modelUsed,
      isRealGPT: modelUsed !== 'mock' && modelUsed !== 'enhanced-mock'
    });

  } catch (error) {
    console.error('Task execution error:', error);
    
    // Mark execution as failed if we created one
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

// Enhanced mock response generator
function generateMockResponse(description, gptUrl) {
  return `## Task Instructions: ${description}

### 📋 Overview
This task requires you to complete the following work assignment with attention to detail and quality.

### 🎯 Objectives
Based on the task description, here are your main objectives:
- Complete the task as specified in the description
- Ensure high-quality output that meets professional standards
- Document your process and results

### 📝 Step-by-Step Instructions

**Step 1: Planning & Research**
- Review the task requirements carefully
- Research any necessary background information
- Create an outline or plan for your approach

**Step 2: Execution**
- Follow your planned approach
- ${gptUrl ? `Use the provided GPT resource: ${gptUrl}` : 'Use available tools and resources'}
- Focus on quality and accuracy

**Step 3: Review & Polish**
- Review your completed work
- Check for errors or areas for improvement
- Ensure all requirements have been met

**Step 4: Documentation**
- Document your process and any insights gained
- Prepare your submission with clear formatting
- Include any relevant notes or recommendations

### 🔗 Resources
${gptUrl ? `- GPT Assistant: ${gptUrl}` : '- Use your preferred tools and resources'}
- Company guidelines and standards
- Relevant industry best practices

### ✅ Completion Checklist
- [ ] Task requirements understood
- [ ] Research completed
- [ ] Work executed according to plan
- [ ] Quality review conducted
- [ ] Documentation prepared
- [ ] Ready for submission

**Note:** This is a comprehensive task guide. Use the log upload feature to submit your completed work and receive detailed feedback.

---
*Generated by GPT Command Center - Enhanced Task Assistant*`;
}