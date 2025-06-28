'use client';

import { useState } from 'react';
import { Play, CheckCircle, ExternalLink, Clock, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Spinner from '../ui/spinner';

export default function TaskList({ tasks, onTaskUpdate, updateTaskStatus, updatingTasks }) {
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const canRestartTask = (task) => {
    if (!task.completed_at || task.status !== 'completed') return false;
    
    const completedAt = new Date(task.completed_at);
    const now = new Date();
    
    switch (task.frequency?.toLowerCase()) {
      case 'five-minutes':
        const fiveMinInMs = 5 * 60 * 1000;
        return (now - completedAt) >= fiveMinInMs;
      
      case 'hourly':
        const hourInMs = 60 * 60 * 1000;
        return (now - completedAt) >= hourInMs;

      case 'daily':
        return completedAt.toDateString() !== now.toDateString();
      
      case 'weekly':
        const weekInMs = 7 * 24 * 60 * 60 * 1000;
        return (now - completedAt) >= weekInMs;
      
      case 'monthly':
        return completedAt.getMonth() !== now.getMonth() || 
               completedAt.getFullYear() !== now.getFullYear();
      
      default:
        return false;
    }
  };

  const getNextAvailableTime = (task) => {
    if (!task.completed_at || canRestartTask(task)) return null;
    
    const completedAt = new Date(task.completed_at);
    
    switch (task.frequency?.toLowerCase()) {
      case 'five-minutes':
        const nextFiveMin = new Date(completedAt.getTime() + (5 * 60 * 1000));
        return nextFiveMin;
      
      case 'hourly':
        const nextHour = new Date(completedAt.getTime() + (60 * 60 * 1000));
        return nextHour;
        
      case 'daily':
        const nextDay = new Date(completedAt);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        return nextDay;
      
      case 'weekly':
        const nextWeek = new Date(completedAt);
        const day = nextWeek.getDay();
        const daysUntilNextMonday = ((8 - day) % 7) || 7;
        nextWeek.setDate(nextWeek.getDate() + daysUntilNextMonday);
        nextWeek.setHours(0, 0, 0, 0);
        return nextWeek;
      
      case 'monthly':
        const nextMonth = new Date(completedAt);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        return nextMonth;
      
      default:
        return null;
    }
  };

  const formatNextAvailableDate = (nextAvailable) => {
    if (!nextAvailable) return '';
    
    const now = new Date();
    const isToday = nextAvailable.toDateString() === now.toDateString();
    const isTomorrow = nextAvailable.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) {
      return `Today at ${nextAvailable.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${nextAvailable.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else {
      return nextAvailable.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleTaskAction = (task) => {
    const canRestart = canRestartTask(task);
    
    if (task.status === 'completed' && canRestart) {
      updateTaskStatus(task.id, 'pending');
    } else if (task.status === 'in_progress') {
      updateTaskStatus(task.id, 'completed', new Date().toISOString());
    } else {
      updateTaskStatus(task.id, 'in_progress');
    }
  };

  const getButtonContent = (task) => {
    if (updatingTasks?.has(task.id)) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
          Updating...
        </>
      );
    }

    const canRestart = canRestartTask(task);

    if (task.status === 'completed' && canRestart) {
      return (
        <>
          <Play className="h-4 w-4 mr-1" />
          Start Again
        </>
      );
    }

    if (task.status === 'completed') {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-1" />
          Completed
        </>
      );
    }

    if (task.status === 'in_progress') {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-1" />
          Mark Complete
        </>
      );
    }

    return (
      <>
        <Play className="h-4 w-4 mr-1" />
        Start Task
      </>
    );
  };

  const getButtonStyle = (task) => {
    const canRestart = canRestartTask(task);

    if (task.status === 'completed' && !canRestart) {
      return "w-full bg-gray-400 text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-not-allowed disabled:opacity-50 flex items-center justify-center";
    }

    if (task.status === 'completed' && canRestart) {
      return "w-full bg-blue-600 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    }

    if (task.status === 'in_progress') {
      return "w-full bg-green-600 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    }

    return "w-full bg-blue-600 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  };

  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case 'completed_at':
          aValue = new Date(a.completed_at || 0);
          bValue = new Date(b.completed_at || 0);
          break;
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'frequency':
          const frequencyOrder = {
            'once': 0,
            'five-minutes': 1,
            'hourly': 2,
            'daily': 3,
            'weekly': 4,
            'monthly': 5,
          };
          
          aValue = frequencyOrder[a.frequency?.toLowerCase()] || 999;
          bValue = frequencyOrder[b.frequency?.toLowerCase()] || 999;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUpDown className="h-3 w-3" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const pendingTasks = sortTasks(tasks.filter(task => 
    task.status === 'pending' || task.status === 'Not Started' || !task.status
  ));
  const inProgressTasks = sortTasks(tasks.filter(task => task.status === 'in_progress'));
  const completedTasks = sortTasks(tasks.filter(task => task.status === 'completed'));

  const TaskCard = ({ task }) => {
    const canRestart = canRestartTask(task);
    const nextAvailable = getNextAvailableTime(task);
    const formattedNextDate = formatNextAvailableDate(nextAvailable);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-md font-medium text-gray-900 mb-2">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            
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
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  GPT Link
                </a>
              )}
            </div>

            {/* Show next available time for completed tasks */}
            {task.status === 'completed' && !canRestart && nextAvailable && (
              <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="text-xs text-blue-800 font-medium">Available again:</div>
                <div className="text-sm text-blue-900 font-semibold">{formattedNextDate}</div>
              </div>
            )}

            {/* Show completion time for completed tasks */}
            {task.status === 'completed' && task.completed_at && (
              <div className="text-xs text-gray-500 mb-3">
                Completed: {new Date(task.completed_at).toLocaleString('en-US', {
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

          <button
            onClick={() => handleTaskAction(task)}
            disabled={updatingTasks?.has(task.id) || (task.status === 'completed' && !canRestart)}
            className={getButtonStyle(task)}
          >
            {getButtonContent(task)}
          </button>
        </div>
      </div>
    );
  };

  const ColumnHeader = ({ title, count, bgColor, textColor }) => (
    <div className={`${bgColor} ${textColor} p-4 rounded-t-lg`}>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm opacity-90">{count} tasks</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with sorting controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <span className="text-sm text-gray-500">{tasks.length} total tasks</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => handleSort('created_at')}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Created {getSortIcon('created_at')}
          </button>
          <button
            onClick={() => handleSort('completed_at')}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Completed {getSortIcon('completed_at')}
          </button>
          <button
            onClick={() => handleSort('title')}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Title {getSortIcon('title')}
          </button>
          <button
            onClick={() => handleSort('frequency')}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Frequency {getSortIcon('frequency')}
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No tasks assigned</h3>
          <p className="mt-1 text-sm">Tasks will appear here when assigned by an admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div className="flex flex-col">
            <ColumnHeader 
              title="Pending" 
              count={pendingTasks.length}
              bgColor="bg-blue-500"
              textColor="text-gray-300"
            />
            <div className="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-4 flex-1">
              <div className="space-y-4">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">No pending tasks</div>
                  </div>
                ) : (
                  pendingTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col">
            <ColumnHeader 
              title="In Progress" 
              count={inProgressTasks.length}
              bgColor="bg-yellow-500"
              textColor="text-gray-300"
            />
            <div className="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-4 flex-1">
              <div className="space-y-4">
                {inProgressTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">No tasks in progress</div>
                  </div>
                ) : (
                  inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col">
            <ColumnHeader 
              title="Completed" 
              count={completedTasks.length}
              bgColor="bg-green-500"
              textColor="text-gray-300"
            />
            <div className="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-4 flex-1">
              <div className="space-y-4">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">No completed tasks</div>
                  </div>
                ) : (
                  completedTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}