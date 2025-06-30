'use client';

import { useState, useEffect } from 'react';
import { X, Save, Clock, ExternalLink, Users, Bell } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/contexts/toast-context';

export default function EditTaskModal({ task, isOpen, onClose, onUpdate }) {
  const { showToast } = useToast();
  const { users, loading: usersLoading } = useUsers();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gpt_url: '',
    evaluation_prompt: '',
    frequency: 'daily',
    notification_type: 'popup',
    assigned_user_ids: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        gpt_url: task.gpt_url || '',
        evaluation_prompt: task.evaluation_prompt || '',
        frequency: task.frequency || 'daily',
        notification_type: task.notification_type || 'popup',
        assigned_user_ids: Array.isArray(task.task_assignments)
          ? task.task_assignments.map(a => a.user_id)
          : []
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        showToast('Title and description are required', 'error');
        return;
      }

      if (!formData.assigned_user_ids.length) {
        showToast('Please select at least one user to assign the task to', 'error');
        return;
      }

      await onUpdate({
        id: task.id,
        ...formData
      });
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Failed to update task', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

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
              <h3 className="text-lg font-medium text-gray-900">Edit Task</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-scroll px-6 py-4 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what needs to be done..."
                required
              />
            </div>

            {/* GPT URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.gpt_url}
                  onChange={(e) => setFormData({ ...formData, gpt_url: e.target.value })}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://chatgpt.com/g/..."
                />
                <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evaluation Prompt
              </label>
              <textarea
                value={formData.evaluation_prompt}
                onChange={(e) => setFormData({ ...formData, evaluation_prompt: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what needs to be done..."
                required
              />
            </div>

            {/* Frequency and Notification Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="once">Once</option>
                  <option value="five-minutes">Every 5 Minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bell className="inline h-4 w-4 mr-1" />
                  Notification Type
                </label>
                <select
                  value={formData.notification_type}
                  onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="popup">Popup Only</option>
                  <option value="sound">Sound Only</option>
                  <option value="both">Popup + Sound</option>
                </select>
              </div>
            </div>

            {/* User Assignment as Checklist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Assign To Users *
              </label>
              {usersLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                  Loading users...
                </div>
              ) : (
                <div className="border border-gray-300 rounded-md p-3 max-h-56 overflow-y-auto">
                  {users
                    .filter(user => user.role === 'admin' || user.role === 'worker')
                    .map((user) => (
                      <label key={user.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={user.id}
                          checked={formData.assigned_user_ids.includes(user.id)}
                          onChange={e => {
                            const checked = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              assigned_user_ids: checked
                                ? [...prev.assigned_user_ids, user.id]
                                : prev.assigned_user_ids.filter(id => id !== user.id)
                            }));
                          }}
                        />
                        <span>
                          {user.name || user.email} <span className="text-xs text-gray-500">({user.role})</span>
                        </span>
                      </label>
                    ))}
                  {users.length === 0 && (
                    <div className="text-gray-400 text-sm">No users available</div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Task
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}