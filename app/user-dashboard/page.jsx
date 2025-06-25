'use client';

import { useState } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useGPTCenter } from '@/hooks/useGPTCenter';
import TaskList from '@/components/gpt-center/task-list';
import TaskCreation from '@/components/gpt-center/task-creation';
import LogUpload from '@/components/gpt-center/log-upload';
import EvaluationTable from '@/components/gpt-center/evaluation-table';
import Spinner from '@/components/ui/spinner';

export default function Dashboard() {
  const { session, status, role } = useAuthWithRedirect();
  const { 
    tasks, 
    evaluations, 
    loading, 
    executingTasks,
    updatingTasks,
    fetchTasks, 
    fetchEvaluations, 
    createTask,
    executeTask,
    updateTaskStatus,
    uploadLog 
  } = useGPTCenter(session);
  const [activeTab, setActiveTab] = useState('tasks');

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
    tab.role === 'all' || (tab.role === 'admin' && role === 'admin')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your tasks and evaluations
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
          <TaskList 
            tasks={tasks} 
            onTaskUpdate={fetchTasks}
            updateTaskStatus={updateTaskStatus}
            updatingTasks={updatingTasks}
          />
        )}
        {activeTab === 'upload' && (
          <LogUpload tasks={tasks} uploadLog={uploadLog} />
        )}
        {activeTab === 'evaluations' && (
          <EvaluationTable 
            userRole={role} 
            evaluations={evaluations}
            fetchEvaluations={fetchEvaluations}
            loading={loading}
          />
        )}
        {activeTab === 'create' && role === 'admin' && (
          <TaskCreation createTask={createTask} />
        )}
        {activeTab === 'manage' && role === 'admin' && (
          <div>Admin Management Panel - Coming Soon</div>
        )}
      </div>
    </div>
  );
}