'use client';

import { Eye, Edit, Trash2, ExternalLink, User, Calendar } from 'lucide-react';

export default function AdminTasksTable({ 
  filteredTasks, 
  allTasks, 
  onViewTask, 
  onEditTask, 
  onDeleteTask 
}) {
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

  return (
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
                <tr key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onViewTask(task)}>
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
                          onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewTask(task);
                        }}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="cursor-pointer text-yellow-600 hover:text-yellow-800 transition-colors"
                        title="Edit Task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task);
                        }}
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
  );
}