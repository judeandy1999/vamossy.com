'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';
import { Play, ExternalLink, Clock, CheckCircle } from 'lucide-react';

export default function TaskList({ tasks, onTaskUpdate }) {
  const { showToast } = useToast();
  const [executingTasks, setExecutingTasks] = useState(new Set());

  const executeTask = async (task) => {
    if (executingTasks.has(task.id)) return;

    setExecutingTasks(prev => new Set([...prev, task.id]));
    
    try {
      // Get current session to ensure we're authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Not authenticated');
      }

      // Call the API with proper headers (following your existing pattern)
      const response = await fetch('/api/gpt-center/execute-task', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          taskId: task.id,
          description: task.description,
          gptUrl: task.gpt_url
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Show notification based on task.notification_type
      if (task.notification_type === 'popup' || task.notification_type === 'both') {
        showToast(`Task "${task.title}" executed successfully!`, 'success');
      }
      
      if (task.notification_type === 'sound' || task.notification_type === 'both') {
        // Play notification sound
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {}); // Ignore if audio fails
        } catch (err) {
          console.log('Audio notification failed');
        }
      }

      onTaskUpdate?.();
    } catch (err) {
      console.error('Task execution error:', err);
      showToast(`Failed to execute task: ${err.message}`, 'error');
    } finally {
      setExecutingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Tasks</h2>
        <span className="text-sm text-gray-500">{tasks.length} tasks assigned</span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No tasks assigned</h3>
          <p className="mt-1 text-sm">Tasks will appear here when assigned by an admin.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.frequency}
                    </span>
                    {task.gpt_url && (
                      <a 
                        href={task.gpt_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-blue-600"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        GPT Link
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => executeTask(task)}
                  disabled={executingTasks.has(task.id)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {executingTasks.has(task.id) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Execute
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}