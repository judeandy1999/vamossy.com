'use client';

import { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, Search, Filter, ExternalLink, Calendar, Clock, User } from 'lucide-react';
import { useToast } from '@/contexts/toast-context';
import TaskDetailsModal from './task-details-modal';
import EditTaskModal from './edit-task-modal';
import Modal from '@/components/ui/modal';
import { canRestartTask, getNextAvailableTime, formatNextAvailableDate } from '@/utils/task-utils';

export default function AdminTaskManagement({ 
  allTasks,
  updateTaskStatus, 
  updatingTasks, 
  deleteTask, 
  updateTask,
  fetchAllTasks 
}) {
  const { showToast } = useToast();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        await fetchAllTasks();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [fetchAllTasks]);

  useEffect(() => {
    let filtered = allTasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (frequencyFilter !== 'all') {
      filtered = filtered.filter(task => task.frequency === frequencyFilter);
    }

    if (userFilter !== 'all') {
      filtered = filtered.filter(task => task.assigned_user_id === userFilter);
    }

    setFilteredTasks(filtered);
  }, [allTasks, searchTerm, statusFilter, frequencyFilter, userFilter]);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      showToast('Task deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      showToast('Task updated successfully', 'success');
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Failed to update task', 'error');
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchAllTasks();
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pending' },
      'in_progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getFrequencyBadge = (frequency) => {
    const colors = {
      'once': 'bg-gray-100 text-gray-800',
      'five-minutes': 'bg-purple-100 text-purple-800',
      'hourly': 'bg-orange-100 text-orange-800',
      'daily': 'bg-blue-100 text-blue-800',
      'weekly': 'bg-green-100 text-green-800',
      'monthly': 'bg-indigo-100 text-indigo-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[frequency] || colors['daily']}`}>
        {frequency}
      </span>
    );
  };

  // Get unique users for filter
  const uniqueUsers = [...new Map(
    allTasks
      .filter(task => task.users)
      .map(task => [task.assigned_user_id, task.users])
  ).values()];

  const uniqueFrequencies = [...new Set(allTasks.map(task => task.frequency))].filter(Boolean);

  if (loading && allTasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Task Management</h2>
          <p className="text-gray-600 mt-1">Manage all tasks across the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{filteredTasks.length} of {allTasks.length} tasks</span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Frequency Filter */}
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Frequencies</option>
            {uniqueFrequencies.map(freq => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>

          {/* User Filter */}
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {allTasks.length === 0 ? 'No tasks found' : 'No tasks match your filters'}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    {/* Task Info */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {task.description}
                        </div>
                        {task.gpt_url && (
                          <a 
                            href={task.gpt_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            GPT Link
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Assigned User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {task.users?.name || task.users?.email || 'Unassigned'}
                          </div>
                          {task.users?.email && task.users?.name && (
                            <div className="text-xs text-gray-500">{task.users.email}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(task.status)}
                      {task.status === 'completed' && task.completed_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(task.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* Frequency */}
                    <td className="px-6 py-4">
                      {getFrequencyBadge(task.frequency)}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewTask(task)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Edit Task"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTask(null);
        }}
        updateTaskStatus={updateTaskStatus}
        updatingTasks={updatingTasks}
      />

      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
        target={{ type: 'task', name: taskToDelete?.title }}
        isLoading={deleting}
      />
    </div>
  );
}