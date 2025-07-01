import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';
import { getUserRole } from '@/utils/getUserRole';

export function useGPTCenter(session = null) {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationLoading, setEvaluationLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('worker');
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
      console.log('Fetched tasks:', data);
      
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

  const fetchAllTasks = useCallback(async () => {
    if (!session?.user) return;
    const accessToken = session?.access_token;
    
    try {
      const response = await fetch('/api/gpt-center/tasks?all=true', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setAllTasks(data.tasks || []);
      return data.tasks || [];
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      showToast('Failed to fetch tasks', 'error');
      throw error;
    }
  }, [session, showToast]);

  useEffect(() => {
    fetchUserRole();
    if (session?.user) {
      fetchTasks();
    }
  }, [session]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`/api/gpt-center/tasks?id=${taskId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${currentSession.access_token}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      showToast('Task deleted successfully!', 'success');
      
      await fetchTasks();
      if (userRole === 'admin') {
        await fetchAllTasks();
      }
      
    } catch (err) {
      showToast('Failed to delete task', 'error');
      throw err;
    }
}, [session, fetchTasks, fetchAllTasks, userRole, showToast]);

  const updateTask = useCallback(async (taskData) => {
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !currentSession) throw new Error('Not authenticated');

      const response = await fetch('/api/gpt-center/tasks', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.access_token}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showToast('Task updated successfully!', 'success');

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === data.task.id ? { ...task, ...data.task } : task
        )
      );
      if (userRole === 'admin') {
        setAllTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === data.task.id ? { ...task, ...data.task } : task
          )
        );
      }

    } catch (err) {
      showToast('Failed to update task', 'error');
      throw err;
    }
  }, [session, userRole, showToast]);

  const updateTaskStatus = useCallback(async (taskId, status, completedAt) => {
    if (updatingTasks.has(taskId)) return;

    setUpdatingTasks(prev => new Set([...prev, taskId]));
    
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !currentSession) throw new Error('Not authenticated');

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
          completed_at: completedAt || null,
          user_id: currentSession.user.id
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showToast(`Task status updated to ${status.replace('_', ' ')}!`, 'success');

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
              ...task,
              task_assignments: task.task_assignments.map(assignment =>
                assignment.user_id === currentSession.user.id
                  ? { ...assignment, status, completed_at: completedAt || null }
                  : assignment
              )
            }
            : task
        )
      );

      if (userRole === 'admin') {
        setAllTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? {
                ...task,
                task_assignments: task.task_assignments.map(assignment =>
                  assignment.user_id === currentSession.user.id
                    ? { ...assignment, status, completed_at: completedAt || null }
                    : assignment
                )
              }
            : task
          )
        );
      }
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
  }, [session, userRole, updatingTasks, showToast]);

  const checkAndResetTasks = useCallback(async () => {
    if (!tasks.length || !session?.user) return;

    const now = new Date();
    const tasksToReset = [];

    tasks.forEach(task => {
    const assignment = Array.isArray(task.task_assignments) ? task.task_assignments[0] : null;
    if (!assignment) return;

    const { status, completed_at } = assignment;

    if (status === 'completed' && completed_at) {
      const completedAt = new Date(completed_at);
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
        tasksToReset.push({
          taskId: task.id,
          userId: assignment.user_id
        });
      }
    }
  });

    if (tasksToReset.length > 0) {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession) {
          console.error('Not authenticated for task reset');
          return;
        }

        for (const { taskId, userId } of tasksToReset) {
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
                completed_at: null,
                user_id: userId
              })
            });

            if (!response.ok) {
              console.error(`Failed to reset task ${taskId}:`, await response.text());
            }
          } catch (error) {
            console.error(`Failed to reset task ${taskId}:`, error);
          }
        }

        await fetchTasks();
        if (userRole === 'admin') {
          await fetchAllTasks();
        }
        console.log(`Reset ${tasksToReset.length} eligible tasks`);
        
      } catch (error) {
        console.error('Failed to reset tasks:', error);
      }
    }
  }, [tasks, session, fetchTasks, fetchAllTasks, userRole]);

  useEffect(() => {
    if (!tasks.length) return;

    checkAndResetTasks();

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
        setEvaluationLoading(false);
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
        if (userRole === 'admin') {
          await fetchAllTasks();
        }
        showToast('Task created successfully!', 'success');
        return data.task;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showToast('Failed to create task', 'error');
      throw err;
    }
  }, [session, fetchTasks, fetchAllTasks, userRole, showToast]);

  const uploadFileToStorage = useCallback(async (file) => {
  
  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = [
    'text/plain', 
    'text/markdown', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed: TXT, MD, PDF, DOC, DOCX`);
  }

  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `logs/${timestamp}_${cleanName}`;
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Authentication required for file upload');
    }

    const { data, error } = await supabase.storage
      .from('task-logs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        duplex: 'half'
      });

    if (error) {
      if (error.statusCode === 403) {
        throw new Error('Storage access denied. Check bucket policies and authentication.');
      }
      
      if (error.statusCode === 404) {
        throw new Error('Storage bucket not found or inaccessible.');
      }
      
      if (error.message?.toLowerCase().includes('policy')) {
        throw new Error('Storage policy violation. Check RLS policies.');
      }
      
      if (error.message?.toLowerCase().includes('bucket')) {
        throw new Error('Storage bucket error. Check bucket configuration.');
      }
      
      throw new Error(`Storage upload failed: ${error.message || 'Unknown error'}`);
    }
    
    if (!data || !data.path) {
      throw new Error('Upload completed but no file path returned');
    }
    
    return data.path;
    
  } catch (error) {
    throw error;
  }
}, []);

  const uploadLog = useCallback(async ({ taskId, logContent, evaluationPrompt, file, fileContent }) => {
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
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        throw new Error('Not authenticated');
      }

      const user = currentSession.user;
      let fileUrl = null;

      if (file) {
        try {
          fileUrl = await uploadFileToStorage(file);
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
            fileUrl,
            fileContent: fileContent?.trim() || null
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

  const deleteEvaluation = useCallback(async (evaluationId) => {
  if (!session?.user) return;
  const accessToken = session?.access_token;
  
  try {
    const response = await fetch(`/api/gpt-center/delete-evaluation/${evaluationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    showToast('Evaluation deleted successfully', 'success');
    await fetchEvaluations('all', 'created_at');
  } catch (error) {
    showToast('Failed to delete evaluation', 'error');
    throw error;
  }
}, [fetchEvaluations, showToast]);

  return {
    tasks,
    allTasks,
    evaluations,
    loading,
    evaluationLoading,
    userRole,
    updatingTasks,
    fetchTasks,
    fetchAllTasks,
    fetchEvaluations,
    createTask,
    uploadLog,
    updateTaskStatus,
    checkAndResetTasks,
    deleteTask,
    updateTask,
    deleteEvaluation
  };
}