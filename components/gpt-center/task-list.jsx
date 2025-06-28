'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import TaskBoard from './task-board';
import TaskSortControls from './task-sort-controls';
import TaskDetailsModal from './task-details-modal';
import { sortTasks } from '@/utils/task-utils';

export default function TaskList({ tasks, onTaskUpdate, updateTaskStatus, updatingTasks }) {
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

<<<<<<< HEAD
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
=======
  useEffect(() => {
    if (selectedTask && tasks.length > 0) {
      const updatedTask = tasks.find(task => task.id === selectedTask.id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
>>>>>>> main
      }
    }
  }, [tasks, selectedTask]);

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const sortedTasks = sortTasks(tasks, sortBy, sortOrder);

  return (
    <div className="space-y-6">
      {/* Header with sorting controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <span className="text-sm text-gray-500">{tasks.length} total tasks</span>
        </div>
        
        <TaskSortControls 
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No tasks assigned</h3>
          <p className="mt-1 text-sm">Tasks will appear here when assigned by an admin.</p>
        </div>
      ) : (
<<<<<<< HEAD
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
=======
        <TaskBoard 
          tasks={sortedTasks}
          updateTaskStatus={updateTaskStatus}
          updatingTasks={updatingTasks}
          onCardClick={handleCardClick}
        />
>>>>>>> main
      )}

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        updateTaskStatus={updateTaskStatus}
        updatingTasks={updatingTasks}
      />
    </div>
  );
}