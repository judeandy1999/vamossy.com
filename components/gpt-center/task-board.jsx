'use client';

import TaskColumn from './task-column';

export default function TaskBoard({ tasks, updateTaskStatus, updatingTasks, onCardClick }) {
  // Use assignment status for filtering
  const getAssignmentStatus = task =>
    Array.isArray(task.task_assignments) ? task.task_assignments[0]?.status : undefined;

  const pendingTasks = tasks.filter(
    task => ['pending', 'Not Started', null, ''].includes(getAssignmentStatus(task))
  );
  const inProgressTasks = tasks.filter(
    task => getAssignmentStatus(task) === 'in_progress'
  );
  const completedTasks = tasks.filter(
    task => getAssignmentStatus(task) === 'completed'
  );

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