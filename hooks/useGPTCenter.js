// hooks/useGPTCenter.js
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';

export function useGPTCenter() {
  const [tasks, setTasks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('worker');
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserRole();
    fetchTasks();
    fetchEvaluations();
  }, []);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single();
        
        if (!error && userData) {
          setUserRole(userData.role);
        }
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/gpt-center/tasks');
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Failed to load tasks', 'error');
    }
  };

  const fetchEvaluations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('evaluations')
        .select(`
          *,
          tasks(title),
          task_logs(log_content, file_url, uploaded_at),
          users(email, name)
        `)
        .order('created_at', { ascending: false });

      // Filter by user if not admin
      if (userRole !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvaluations(data || []);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      showToast('Failed to load evaluations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await fetch('/api/gpt-center/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Error creating task:', err);
      showToast('Failed to create task', 'error');
      throw err;
    }
  };

  const executeTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const response = await fetch('/api/gpt-center/execute-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          description: task.description,
          gptUrl: task.gpt_url
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast(`Task "${task.title}" executed successfully!`, 'success');
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error executing task:', err);
      showToast('Failed to execute task', 'error');
      throw err;
    }
  };

  const uploadLog = async (logData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('task_logs')
        .insert({
          ...logData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger evaluation
      await fetch('/api/gpt-center/evaluate-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId: data.id,
          taskId: logData.task_id,
          logContent: logData.log_content,
          fileUrl: logData.file_url
        })
      });

      await fetchEvaluations();
      showToast('Log uploaded successfully!', 'success');
      return data;
    } catch (err) {
      console.error('Error uploading log:', err);
      showToast('Failed to upload log', 'error');
      throw err;
    }
  };

  return {
    tasks,
    evaluations,
    loading,
    userRole,
    fetchTasks,
    fetchEvaluations,
    createTask,
    executeTask,
    uploadLog
  };
}