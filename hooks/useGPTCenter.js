import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';
import { getUserRole } from '@/utils/getUserRole';

export function useGPTCenter(session = null) {
  const [tasks, setTasks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('worker');
  const [executingTasks, setExecutingTasks] = useState(new Set());
  const [updatingTasks, setUpdatingTasks] = useState(new Set());
  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    if (!session?.user) return;
    const accessToken = session?.access_token;
    
    try {
      const response = await fetch('/api/gpt-center/tasks', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
      });

      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [session, showToast]);

  useEffect(() => {
    fetchUserRole();
    if (session?.user) {
      fetchTasks();
    }
  }, [session]);

  const updateTaskStatus = useCallback(async (taskId, status, completedAt) => {
    if (updatingTasks.has(taskId)) return;

    setUpdatingTasks(prev => new Set([...prev, taskId]));
    
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/gpt-center/tasks', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.access_token}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          id: taskId,
          status: status,
          completed_at: completedAt || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      showToast(`Task status updated to ${status.replace('_', ' ')}!`, 'success');
      await fetchTasks();
      
    } catch (err) {
      showToast('Failed to update task status', 'error');
      throw err;
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  }, [session, fetchTasks, showToast, updatingTasks]);

  // Separate function to check and reset tasks without circular dependency
  const checkAndResetTasks = useCallback(async () => {
    if (!tasks.length || !session?.user) return;

    const now = new Date();
    const tasksToReset = [];

    tasks.forEach(task => {
      if (task.status === 'completed' && task.completed_at) {
        const completedAt = new Date(task.completed_at);
        let shouldReset = false;

        switch (task.frequency?.toLowerCase()) {
          case 'five-minutes':
            const fiveMinInMs = 5 * 60 * 1000;
            shouldReset = (now - completedAt) >= fiveMinInMs;
            break;
          case 'hourly':
            const hourInMs = 60 * 60 * 1000;
            shouldReset = (now - completedAt) >= hourInMs;
            break;
          case 'daily':
            shouldReset = completedAt.toDateString() !== now.toDateString();
            break;
          case 'weekly':
            const getNextMonday = (date) => {
              const nextMonday = new Date(date);
              const dayOfWeek = date.getDay();
              const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
              nextMonday.setDate(date.getDate() + daysUntilNextMonday);
              nextMonday.setHours(0, 0, 0, 0);
              return nextMonday;
            };
            
            const nextMondayAfterCompletion = getNextMonday(completedAt);
            shouldReset = now >= nextMondayAfterCompletion;
            break;
          case 'monthly':
            shouldReset = completedAt.getMonth() !== now.getMonth() || 
                         completedAt.getFullYear() !== now.getFullYear();
            break;
        }

        if (shouldReset) {
          tasksToReset.push(task.id);
        }
      }
    });

    // Reset eligible tasks directly without using updateTaskStatus to avoid circular dependency
    if (tasksToReset.length > 0) {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession) {
          console.error('Not authenticated for task reset');
          return;
        }

        // Reset multiple tasks at once
        for (const taskId of tasksToReset) {
          try {
            const response = await fetch('/api/gpt-center/tasks', {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentSession.access_token}`,
                'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
              },
              body: JSON.stringify({
                id: taskId,
                status: 'pending',
                completed_at: null
              })
            });

            if (!response.ok) {
              console.error(`Failed to reset task ${taskId}:`, await response.text());
            }
          } catch (error) {
            console.error(`Failed to reset task ${taskId}:`, error);
          }
        }

        // Refresh tasks after resetting
        await fetchTasks();
        console.log(`Reset ${tasksToReset.length} eligible tasks`);
        
      } catch (error) {
        console.error('Failed to reset tasks:', error);
      }
    }
  }, [tasks, session, fetchTasks]);

  // Effect to periodically check for tasks that need to be reset
  useEffect(() => {
    if (!tasks.length) return;

    // Check immediately when tasks change
    checkAndResetTasks();

    // Set up interval to check every 30 seconds (more frequent for testing)
    const interval = setInterval(checkAndResetTasks, 30000);
    
    return () => clearInterval(interval);
  }, [tasks, checkAndResetTasks]);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const role = await getUserRole(user.email);
        setUserRole(role);
      }
    } catch (err) {
      showToast('Failed to fetch user role', 'error');
    }
  };

  const fetchEvaluations = useCallback(async (filter = 'all', sortBy = 'created_at') => {
    if (!session?.user) return;
    const accessToken = session?.access_token;
    
    try {
      const params = new URLSearchParams({ filter, sortBy });
      const response = await fetch(`/api/gpt-center/evaluations?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setEvaluations(data.evaluations || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showToast('Failed to load evaluations', 'error');
    }
  }, [session, showToast]);

  const createTask = useCallback(async (taskData) => {
    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    const accessToken = session?.access_token;
    console.log('Creating task with data:', taskData);
    try {
      const response = await fetch('/api/gpt-center/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchTasks();
        showToast('Task created successfully!', 'success');
        return data.task;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showToast('Failed to create task', 'error');
      throw err;
    }
  }, [session, fetchTasks, showToast]);

  const executeTask = useCallback(async (task) => {
    if (executingTasks.has(task.id)) return;

    setExecutingTasks(prev => new Set([...prev, task.id]));
    
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/gpt-center/execute-task', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.access_token}`,
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
      
      if (task.notification_type === 'popup' || task.notification_type === 'both') {
        showToast(`Task "${task.title}" executed successfully!`, 'success');
      }
      
      if (task.notification_type === 'sound' || task.notification_type === 'both') {
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        } catch (err) {
          console.log('Audio notification failed');
        }
      }

      await fetchTasks();
      return result;
    } catch (err) {
      console.error('Task execution error:', err);
      showToast(`Failed to execute task: ${err.message}`, 'error');
      throw err;
    } finally {
      setExecutingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  }, [executingTasks, fetchTasks, showToast]);

  const uploadFileToStorage = useCallback(async (file) => {
    // Validate file type and size
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'text/plain', 
      'text/markdown', 
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload text, markdown, PDF, or Word documents.');
    }

    const fileName = `logs/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('task-logs')
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  }, []);

  const uploadLog = useCallback(async ({ taskId, logContent, evaluationPrompt, file }) => {
    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    if (!taskId) {
      throw new Error('Please select a task');
    }

    if (!logContent?.trim() && !file) {
      throw new Error('Please provide log content or upload a file');
    }

    try {
      // Get current session for authentication
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        throw new Error('Not authenticated');
      }

      const user = currentSession.user;
      let fileUrl = null;

      // Upload file if provided
      if (file) {
        try {
          fileUrl = await uploadFileToStorage(file);
          console.log('File uploaded:', fileUrl);
        } catch (fileError) {
          showToast('Failed to upload file, but will save log content', 'warning');
        }
      }

      const { data: logData, error: logError } = await supabase
        .from('task_logs')
        .insert({
          task_id: parseInt(taskId),
          user_id: user.id,
          log_content: logContent?.trim() || null,
          file_url: fileUrl
        })
        .select()
        .single();

      if (logError) {
        throw logError;
      }

      try {
        const evaluationResponse = await fetch('/api/gpt-center/evaluate-log', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
          body: JSON.stringify({
            logId: logData.id,
            taskId: parseInt(taskId),
            logContent: logContent?.trim(),
            evaluationPrompt: evaluationPrompt?.trim(),
            fileUrl
          })
        });

        if (evaluationResponse.ok) {
          showToast('Log uploaded and evaluated successfully!', 'success');
        } else {
          showToast('Log uploaded, but evaluation failed. You can still view it in the evaluations tab.', 'warning');
        }
      } catch (evalError) {
        showToast('Log uploaded, but evaluation service is unavailable.', 'warning');
      }

      return logData;
    } catch (error) {
      showToast(`Failed to upload log: ${error.message}`, 'error');
      throw error;
    }
  }, [session, uploadFileToStorage, showToast]);

  return {
    tasks,
    evaluations,
    loading,
    userRole,
    executingTasks,
    updatingTasks,
    fetchTasks,
    fetchEvaluations,
    createTask,
    executeTask,
    uploadLog,
    updateTaskStatus,
    checkAndResetTasks,
  };
}