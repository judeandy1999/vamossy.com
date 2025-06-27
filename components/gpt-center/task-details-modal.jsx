'use client';

import { X, Clock, ExternalLink, Calendar, User, Bell, Tag } from 'lucide-react';
import TaskButton from './task-button';
import { canRestartTask, getNextAvailableTime, formatNextAvailableDate } from '@/utils/task-utils';

export default function TaskDetailsModal({ task, isOpen, onClose, updateTaskStatus, updatingTasks }) {
  if (!isOpen || !task) return null;

  const canRestart = canRestartTask(task);
  const nextAvailable = getNextAvailableTime(task);
  const formattedNextDate = formatNextAvailableDate(nextAvailable);

  const handleTaskAction = async () => {
    try {
      if (task.status === 'completed' && canRestart) {
        await updateTaskStatus(task.id, 'pending');
      } else if (task.status === 'in_progress') {
        await updateTaskStatus(task.id, 'completed', new Date().toISOString());
      } else {
        await updateTaskStatus(task.id, 'in_progress');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
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

  const getFrequencyIcon = (frequency) => {
    const icons = {
      'once': '1x',
      'five-minutes': '5m',
      'hourly': '1h',
      'daily': '1d',
      'weekly': '1w',
      'monthly': '1M'
    };
    return icons[frequency] || frequency;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="!flex backdrop-blur-xs bg-black/20 items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
              <button
                onClick={onClose}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4">
            {/* Title and Status */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 flex-1 mr-4">
                  {task.title}
                </h2>
                {getStatusBadge(task.status)}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">
                {task.description || 'No description provided'}
              </p>
            </div>

            {/* Task Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Frequency */}
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Frequency</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium mr-2">
                      {getFrequencyIcon(task.frequency)}
                    </span>
                    {task.frequency}
                  </div>
                </div>
              </div>

              {/* Notification Type */}
              {task.notification_type && (
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Notifications</div>
                    <div className="text-sm text-gray-600 capitalize">{task.notification_type}</div>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Created</div>
                  <div className="text-sm text-gray-600">
                    {new Date(task.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* Completion Date */}
              {task.status === 'completed' && task.completed_at && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Completed</div>
                    <div className="text-sm text-gray-600">
                      {new Date(task.completed_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GPT Link */}
            {task.gpt_url && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">GPT Project Link</h4>
                <a 
                  href={task.gpt_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open GPT Project
                </a>
              </div>
            )}

            {/* Next Available Time */}
            {task.status === 'completed' && !canRestart && nextAvailable && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Next Available</h4>
                <p className="text-blue-900 font-semibold">{formattedNextDate}</p>
                <p className="text-sm text-blue-700 mt-1">
                  This task can be restarted after the frequency interval has passed.
                </p>
              </div>
            )}

            {/* Task ID (for debugging/reference) */}
            <div className="text-xs text-gray-400 mb-6">
              Task ID: {task.id}
            </div>
          </div>

          {/* Footer with Action Button */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              
              <div className="w-48">
                <TaskButton
                  task={task}
                  onAction={handleTaskAction}
                  isUpdating={updatingTasks?.has(task.id)}
                  canRestart={canRestart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}