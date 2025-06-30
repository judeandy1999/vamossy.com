'use client';
import { useUsers } from '@/hooks/useUsers';

import { useState } from 'react';
import { useToast } from '@/contexts/toast-context';
import { Plus, Users, Clock, Bell, ExternalLink } from 'lucide-react';

export default function TaskCreation({ createTask }) {
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
  const [showUserSelect, setShowUserSelect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.assigned_user_ids.length) {
        showToast('Please select at least one user to assign the task to', 'error');
        return;
      }

      await createTask(formData);

      setFormData({
        title: '',
        description: '',
        gpt_url: '',
        evaluation_prompt: '',
        frequency: 'daily',
        notification_type: 'popup',
        assigned_user_ids: []
      });
      setShowUserSelect(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowUserSelect = () => {
    setShowUserSelect(true);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Task
        </h2>
        <p className="text-gray-600 mt-1">
          Create and assign tasks to team members for GPT-assisted completion.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="https://www.projectlink.com/g/..."
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
            placeholder="How would you like the AI to evaluate this task? What specific aspects should it focus on?"
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
              <option value="once">One Time</option>
              <option value="five-minutes">Every 5 minutes</option>
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
            Assign To Users
          </label>
          {!showUserSelect ? (
            <button
              type="button"
              onClick={handleShowUserSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-gray-500 hover:bg-gray-50"
            >
              Click to load users...
            </button>
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}