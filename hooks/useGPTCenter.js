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
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserRole();
    if (session?.user) {
      fetchTasks();
    }
  }, [session]);

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

  const uploadLog = useCallback(async ({ taskId, logContent, file }) => {
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
    fetchTasks,
    fetchEvaluations,
    createTask,
    executeTask,
    uploadLog
  };
}