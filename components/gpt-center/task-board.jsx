'use client';

import TaskColumn from './task-column';
import { filterTasksByStatus } from '@/utils/task-utils';

export default function TaskBoard({ tasks, updateTaskStatus, updatingTasks, onCardClick }) {
  const pendingTasks = filterTasksByStatus(tasks, ['pending', 'Not Started', null]);
  const inProgressTasks = filterTasksByStatus(tasks, ['in_progress']);
  const completedTasks = filterTasksByStatus(tasks, ['completed']);

  const columns = [
    {
      title: 'Pending',
      tasks: pendingTasks,
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    },
    {
      title: 'In Progress',
      tasks: inProgressTasks,
      bgColor: 'bg-yellow-500',
      textColor: 'text-white'
    },
    {
      title: 'Completed',
      tasks: completedTasks,
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => (
        <TaskColumn
          key={column.title}
          title={column.title}
          tasks={column.tasks}
          bgColor={column.bgColor}
          textColor={column.textColor}
          updateTaskStatus={updateTaskStatus}
          updatingTasks={updatingTasks}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}