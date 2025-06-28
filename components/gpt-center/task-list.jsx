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

  useEffect(() => {
    if (selectedTask && tasks.length > 0) {
      const updatedTask = tasks.find(task => task.id === selectedTask.id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
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
        <TaskBoard 
          tasks={sortedTasks}
          updateTaskStatus={updateTaskStatus}
          updatingTasks={updatingTasks}
          onCardClick={handleCardClick}
        />
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