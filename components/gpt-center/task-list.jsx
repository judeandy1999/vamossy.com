'use client';

import { Play, ExternalLink, Clock } from 'lucide-react';
import Spinner from '../ui/spinner';

export default function TaskList({ tasks, onTaskUpdate, executeTask, executingTasks }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Tasks</h2>
        <span className="text-sm text-gray-500">{tasks.length} tasks assigned</span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No tasks assigned</h3>
          <p className="mt-1 text-sm">Tasks will appear here when assigned by an admin.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.frequency}
                    </span>
                    {task.gpt_url && (
                      <a 
                        href={task.gpt_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-blue-600"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        GPT Link
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => executeTask(task)}
                  disabled={executingTasks.has(task.id)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {executingTasks.size > 0 && (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <svg className="mx-auto w-10 h-10 text-gray-300 animate-spin mb-4" viewBox="0 0 64 64" fill="none"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" className="text-blue-600">
              </path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Executing Task</h3>
            <p className="text-gray-600 mb-4">Please wait while the task is being executed</p>
          </div>
        </div>
      )}
    </div>
  );
}