import { supabase } from '@/utils/client';
import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {  
  if (!authenticate(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const { user, error: authError } = await verifySupabaseAuth(req);
    if (authError) {
      console.error('Auth error:', authError);
      return res.status(401).json({ error: authError });
    }

    const { logId, taskId, logContent, fileUrl } = req.body;

    if (!logId || !taskId) {
      return res.status(400).json({ error: 'Missing required fields: logId and taskId' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Verify the log belongs to this user
    const { data: logData, error: logError } = await supabase
      .from('task_logs')
      .select(`
        *,
        tasks (
          id, title, description
        )
      `)
      .eq('id', logId)
      .eq('user_id', user.id)
      .single();

    if (logError || !logData) {
      console.error('Log fetch error:', logError);
      return res.status(404).json({ error: 'Log not found or access denied' });
    }

    console.log('Log found:', logData.id);

    // Prepare content for evaluation
    let contentToEvaluate = logContent || logData.log_content || '';
    
    if (fileUrl) {
      contentToEvaluate += `\n\n[Note: This log includes an attached file: ${fileUrl}]`;
    }

    if (!contentToEvaluate.trim()) {
      return res.status(400).json({ error: 'No content to evaluate' });
    }

    // Create evaluation prompt
    const evaluationPrompt = `
You are an expert task evaluator. Please evaluate the following task completion log and provide structured feedback.

Task Details:
- Title: ${logData.tasks?.title || 'Unknown'}
- Description: ${logData.tasks?.description || 'No description available'}

Completed Work Log:
${contentToEvaluate}

Please provide an evaluation in JSON format only (no markdown, no code blocks, just pure JSON):
{
  "score": [number between 0-100],
  "feedback": "[detailed feedback on the work quality, completeness, and areas for improvement]",
  "strengths": "[what was done well]",
  "improvements": "[specific suggestions for improvement]",
  "completeness": "[assessment of task completion]"
}

Consider these criteria:
1. Task completion and adherence to requirements
2. Quality of work and attention to detail
3. Clear communication and documentation
4. Effort and thoroughness
5. Creativity and problem-solving approach

Respond with ONLY the JSON object, no additional text or formatting.
`;

    console.log('Calling OpenAI API for evaluation');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-11-20',
        messages: [
          {
            role: 'system',
            content: 'You are an expert evaluator who provides constructive, detailed feedback on task completion. Always respond with ONLY valid JSON - no markdown, no code blocks, no additional text.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API request failed: ${errorData.error?.message || openAIResponse.statusText}`);
    }

    const openAIData = await openAIResponse.json();
    let evaluationText = openAIData.choices[0]?.message?.content;
    
    console.log('OpenAI response received');
    console.log('Raw response:', evaluationText);

    // Clean up the response - remove markdown code blocks if present
    if (evaluationText) {
      // Remove markdown code blocks (```json ... ``` or ``` ... ```)
      evaluationText = evaluationText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Remove any leading/trailing whitespace or newlines
      evaluationText = evaluationText.trim();
      
      console.log('Cleaned response:', evaluationText);
    }

    // Parse the JSON response
    let evaluationData;
    try {
      evaluationData = JSON.parse(evaluationText);
      console.log('Successfully parsed evaluation data:', evaluationData);
    } catch (parseError) {
      console.error('Failed to parse evaluation JSON:', parseError);
      console.error('Cleaned response that failed to parse:', evaluationText);
      
      // If JSON parsing still fails, try to extract JSON from the text
      const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          evaluationData = JSON.parse(jsonMatch[0]);
          console.log('Successfully extracted and parsed JSON:', evaluationData);
        } catch (extractError) {
          console.error('Failed to extract and parse JSON:', extractError);
          throw new Error('Failed to parse AI evaluation response. Please try again.');
        }
      } else {
        throw new Error('No valid JSON found in AI response. Please try again.');
      }
    }

    // Validate the evaluation data structure
    if (typeof evaluationData.score !== 'number' || evaluationData.score < 0 || evaluationData.score > 100) {
      console.error('Invalid score:', evaluationData.score);
      throw new Error('Invalid evaluation score received from AI');
    }

    if (!evaluationData.feedback || typeof evaluationData.feedback !== 'string') {
      console.error('Invalid feedback:', evaluationData.feedback);
      throw new Error('Invalid evaluation feedback received from AI');
    }

    // Store evaluation in database
    console.log('Storing evaluation in database');
    const { data: evaluation, error: evalError } = await supabase
      .from('evaluations')
      .insert({
        task_id: taskId,
        log_id: logId,
        user_id: user.id,
        evaluator_response: {
          content: evaluationText,
          raw_content: openAIData.choices[0]?.message?.content,
          parsed: evaluationData,
          tokens_used: openAIData.usage?.total_tokens,
          model: 'gpt-4o-2024-11-20'
        },
        score: evaluationData.score,
        feedback: evaluationData.feedback
      })
      .select()
      .single();

    if (evalError) {
      console.error('Evaluation storage error:', evalError);
      throw evalError;
    }

    console.log('Evaluation completed successfully');
    return res.status(200).json({
      success: true,
      evaluation: {
        id: evaluation.id,
        score: evaluationData.score,
        feedback: evaluationData.feedback,
        strengths: evaluationData.strengths,
        improvements: evaluationData.improvements,
        completeness: evaluationData.completeness,
        model: 'gpt-4o-2024-11-20',
        tokensUsed: openAIData.usage?.total_tokens
      }
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to evaluate log',
      details: error.message 
    });
  }
}