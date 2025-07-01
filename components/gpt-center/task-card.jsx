'use client';

import { Clock, ExternalLink } from 'lucide-react';
import TaskButton from './task-button';
import { canRestartTask, getNextAvailableTime, formatNextAvailableDate } from '@/utils/task-utils';

export default function TaskCard({ task, updateTaskStatus, updatingTasks, onCardClick }) {
  const assignment = Array.isArray(task.task_assignments) ? task.task_assignments[0] : null;
  const status = assignment?.status;
  const completed_at = assignment?.completed_at;
  const canRestart = canRestartTask(task);
  const nextAvailable = getNextAvailableTime(task);
  const formattedNextDate = formatNextAvailableDate(nextAvailable);
  
  const handleTaskAction = (e) => {
    e.stopPropagation();

    if (!assignment) return;

    if (status === 'completed' && canRestart) {
      updateTaskStatus(task.id, 'pending', null, assignment.user_id);
    } else if (status === 'in_progress') {
      updateTaskStatus(task.id, 'completed', new Date().toISOString(), assignment.user_id);
    } else {
      updateTaskStatus(task.id, 'in_progress', null, assignment.user_id);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(task);
    }
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="text-md text-gray-400">Task: #{task.id}</div>
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{task.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
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
                onClick={handleLinkClick}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Project Link
              </a>
            )}
          </div>

          {/* Show next available time for completed tasks */}
          {status === 'completed' && !canRestart && nextAvailable && (
            <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-200">
              <div className="text-xs text-blue-800 font-medium">Available again:</div>
              <div className="text-sm text-blue-900 font-semibold">{formattedNextDate}</div>
            </div>
          )}

          {/* Show completion time for completed tasks */}
          {status === 'completed' && completed_at && (
            <div className="text-xs text-gray-500 mb-3">
              Completed: {new Date(completed_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}

          {/* Show creation time */}
          <div className="text-xs text-gray-500 mb-3">
            Created: {new Date(task.created_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <div onClick={handleTaskAction}>
          <TaskButton
            task={task}
            onAction={handleTaskAction}
            isUpdating={updatingTasks?.has(task.id)}
            canRestart={canRestart}
          />
        </div>
      </div>
    </div>
  );
}