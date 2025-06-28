'use client';

import { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, Search, Filter, ExternalLink, Calendar, Clock, User, FileText, Star } from 'lucide-react';
import { useToast } from '@/contexts/toast-context';
import TaskDetailsModal from './task-details-modal';
import EditTaskModal from './edit-task-modal';
import Modal from '@/components/ui/modal';
import EvaluationDetailsModal from './evaluation-details-modal';

export default function AdminTaskManagement({ 
  allTasks,
  updateTaskStatus, 
  updatingTasks, 
  deleteTask, 
  updateTask,
  fetchAllTasks,
  evaluations,
  fetchEvaluations,
  evaluationLoading
}) {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('tasks');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [evaluationFilter, setEvaluationFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [userEvaluationFilter, setUserEvaluationFilter] = useState('all'); // New filter for evaluations
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized && allTasks.length === 0) {
      setHasInitialized(true);
      const loadData = async () => {
        setLoading(true);
        try {
          await fetchAllTasks();
          await fetchEvaluations('all', 'created_at');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [hasInitialized, allTasks.length]);

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

  useEffect(() => {
    let filtered = evaluations || [];

    if (searchTerm) {
      filtered = filtered.filter(evaluation => 
        evaluation.tasks?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.tasks?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.task_logs?.log_content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (evaluationFilter !== 'all') {
      const now = new Date();
      let dateFilter = null;
      
      switch (evaluationFilter) {
        case 'daily':
          dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      if (dateFilter) {
        filtered = filtered.filter(evaluation => 
          new Date(evaluation.created_at) >= dateFilter
        );
      }
    }

    if (scoreFilter !== 'all') {
      const [min, max] = scoreFilter.split('-').map(Number);
      filtered = filtered.filter(evaluation => 
        evaluation.score >= min && evaluation.score <= max
      );
    }

    // Add user filter for evaluations
    if (userEvaluationFilter !== 'all') {
      filtered = filtered.filter(evaluation => 
        evaluation.user_id === userEvaluationFilter
      );
    }

    setFilteredEvaluations(filtered);
  }, [evaluations, searchTerm, evaluationFilter, scoreFilter, userEvaluationFilter]);

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

  const handleViewEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEvaluationModalOpen(true);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchAllTasks();
      await fetchEvaluations('all', 'created_at');
    } catch (error) {
      console.error('Error refreshing tasks:', error);
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

  const getScoreBadge = (score) => {
    let bgColor, textColor;
    if (score >= 90) {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else if (score >= 80) {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
    } else if (score >= 70) {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
    } else if (score >= 60) {
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
    } else {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {score}/100
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique users for filter
  const uniqueUsers = [...new Map(
    allTasks
      .filter(task => task.users)
      .map(task => [task.assigned_user_id, task.users])
  ).values()];

  const uniqueFrequencies = [...new Set(allTasks.map(task => task.frequency))].filter(Boolean);

  // Get unique users from evaluations for filter
  const uniqueEvaluationUsers = [...new Map(
    (evaluations || [])
      .filter(evaluation => evaluation.users)
      .map(evaluation => [evaluation.user_id, evaluation.users])
  ).values()];

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
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600 mt-1">Manage all tasks and evaluations across the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveSection('tasks')}
            className={`cursor-pointer py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tasks ({filteredTasks.length})
          </button>
          <button
            onClick={() => setActiveSection('evaluations')}
            className={`cursor-pointer py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'evaluations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Logs & Evaluations ({filteredEvaluations.length})
          </button>
        </nav>
      </div>

      {/* Tasks Section */}
      {activeSection === 'tasks' && (
        <>
          {/* Task Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Task Filters</span>
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

            {/* Task Filter Summary */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Active filters:</span>
              {userFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  User: {uniqueUsers.find(u => u.id === userFilter)?.name || 
                         uniqueUsers.find(u => u.id === userFilter)?.email || 'Unknown'}
                  <button
                    onClick={() => setUserFilter('all')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                  Status: {statusFilter.replace('_', ' ')}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {frequencyFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                  Frequency: {frequencyFilter}
                  <button
                    onClick={() => setFrequencyFilter('all')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {(userFilter !== 'all' || statusFilter !== 'all' || frequencyFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setUserFilter('all');
                    setStatusFilter('all');
                    setFrequencyFilter('all');
                    setSearchTerm('');
                  }}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Task Results Summary */}
          <div className="justify-self-end w-fit bg-white px-4 py-2 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredTasks.length} of {allTasks.length} tasks
            </p>
          </div>

          {/* Task Statistics */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Task Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {/* Status Statistics */}
              <div className="text-center p-3 border border-gray-200 rounded-lg bg-blue-50">
                <p className="text-sm font-medium text-blue-900">Pending</p>
                <p className="text-lg font-bold text-blue-600">
                  {filteredTasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <div className="text-center p-3 border border-gray-200 rounded-lg bg-yellow-50">
                <p className="text-sm font-medium text-yellow-900">In Progress</p>
                <p className="text-lg font-bold text-yellow-600">
                  {filteredTasks.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <div className="text-center p-3 border border-gray-200 rounded-lg bg-green-50">
                <p className="text-sm font-medium text-green-900">Completed</p>
                <p className="text-lg font-bold text-green-600">
                  {filteredTasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="text-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm font-medium text-gray-900">Total Tasks</p>
                <p className="text-lg font-bold text-gray-600">
                  {filteredTasks.length}
                </p>
              </div>
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
                      <tr key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewTask(task)}>
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
                              className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditTask(task)}
                              className="cursor-pointer text-yellow-600 hover:text-yellow-800 transition-colors"
                              title="Edit Task"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task)}
                              className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
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
        </>
      )}

      {/* Evaluations Section */}
      {activeSection === 'evaluations' && (
        <>
          {/* Evaluation Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Evaluation Filters</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks, users, feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* User Filter */}
              <select
                value={userEvaluationFilter}
                onChange={(e) => setUserEvaluationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Users</option>
                {uniqueEvaluationUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <select
                value={evaluationFilter}
                onChange={(e) => setEvaluationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="daily">Today</option>
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">Last 30 Days</option>
              </select>

              {/* Score Filter */}
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Scores</option>
                <option value="90-100">Excellent (90-100)</option>
                <option value="80-89">Good (80-89)</option>
                <option value="70-79">Average (70-79)</option>
                <option value="60-69">Below Average (60-69)</option>
                <option value="0-59">Poor (0-59)</option>
              </select>
            </div>

            {/* Filter Summary */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Active filters:</span>
              {userEvaluationFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  User: {uniqueEvaluationUsers.find(u => u.id === userEvaluationFilter)?.name || 
                         uniqueEvaluationUsers.find(u => u.id === userEvaluationFilter)?.email || 'Unknown'}
                  <button
                    onClick={() => setUserEvaluationFilter('all')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {evaluationFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                  Time: {evaluationFilter}
                  <button
                    onClick={() => setEvaluationFilter('all')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {scoreFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                  Score: {scoreFilter}
                  <button
                    onClick={() => setScoreFilter('all')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {(userEvaluationFilter !== 'all' || evaluationFilter !== 'all' || scoreFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setUserEvaluationFilter('all');
                    setEvaluationFilter('all');
                    setScoreFilter('all');
                    setSearchTerm('');
                  }}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className=" justify-self-end w-fit bg-white px-4 py-2 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredEvaluations.length} of {evaluations?.length || 0} evaluations
            </p>
          </div>

          {/* Evaluations Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Log Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluationLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        Loading evaluations...
                      </td>
                    </tr>
                  ) : filteredEvaluations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        {evaluations?.length === 0 ? 'No evaluations found' : 'No evaluations match your filters'}
                      </td>
                    </tr>
                  ) : (
                    filteredEvaluations.map((evaluation) => (
                      <tr key={evaluation.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewEvaluation(evaluation)}>
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {evaluation.users?.name || 'Unknown User'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {evaluation.users?.email || 'No email'}
                              </div>
                              <div className="text-xs text-gray-400">
                                {evaluation.users?.role || 'worker'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Task Info */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[10rem]">
                              {evaluation.tasks?.title || 'Unknown Task'}
                            </div>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="px-6 py-4">
                          {getScoreBadge(evaluation.score)}
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < Math.round(evaluation.score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Feedback Preview */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-[10rem] truncate">
                            {evaluation.feedback || 'No feedback provided'}
                          </div>
                        </td>

                        {/* Log Content */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {evaluation.task_logs?.log_content ? (
                              <div className="max-w-[10rem] truncate">
                                {evaluation.task_logs.log_content}
                              </div>
                            ) : (
                              'No content'
                            )}
                            {evaluation.task_logs?.file_url && (
                              <div className="flex items-center mt-1 text-xs text-blue-600">
                                <FileText className="h-3 w-3 mr-1" />
                                File attached
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Evaluated Date */}
                        <td className="px-6 py-4 min-w-[10rem]">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-5 w-5 mr-1" />
                            {formatDate(evaluation.created_at)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewEvaluation(evaluation)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
        isButtonDisplayed={false}
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

      <EvaluationDetailsModal
        evaluation={selectedEvaluation}
        isOpen={isEvaluationModalOpen}
        onClose={() => {
          setIsEvaluationModalOpen(false);
          setSelectedEvaluation(null);
        }}
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