'use client';

import { useState, useEffect } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { supabase } from '@/utils/client';
import TaskList from '@/components/gpt-center/task-list';
import TaskCreation from '@/components/gpt-center/task-creation';
import LogUpload from '@/components/gpt-center/log-upload';
import EvaluationTable from '@/components/gpt-center/evaluation-table';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/contexts/toast-context';

export default function GPTCenterPage() {
  const { session, status } = useAuthWithRedirect();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('tasks');
  const [userRole, setUserRole] = useState('worker');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchUserRole();
      fetchTasks();
    }
  }, [session]);

  const fetchUserRole = async () => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.user.email)
        .single();
      
      if (!error && userData) {
        setUserRole(userData.role);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_user_id', session.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <Spinner />;
  }

  const tabs = [
    { id: 'tasks', label: 'My Tasks', role: 'all' },
    { id: 'upload', label: 'Upload Log', role: 'all' },
    { id: 'evaluations', label: 'Evaluations', role: 'all' },
    { id: 'create', label: 'Create Task', role: 'admin' },
    { id: 'manage', label: 'Manage All', role: 'admin' }
  ];

  const visibleTabs = tabs.filter(tab => 
    tab.role === 'all' || (tab.role === 'admin' && userRole === 'admin')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">GPT Command Center</h1>
        <p className="text-gray-600 mt-2">
          Manage your AI-powered tasks and evaluations
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'tasks' && (
          <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
        )}
        {activeTab === 'upload' && (
          <LogUpload tasks={tasks} />
        )}
        {activeTab === 'evaluations' && (
          <EvaluationTable userRole={userRole} />
        )}
        {activeTab === 'create' && userRole === 'admin' && (
          <TaskCreation onTaskCreated={fetchTasks} />
        )}
        {activeTab === 'manage' && userRole === 'admin' && (
          <div>Admin Management Panel - Coming Soon</div>
        )}
      </div>
    </div>
  );
}