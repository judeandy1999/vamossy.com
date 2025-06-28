'use client';

import TaskCard from './task-card';

const ColumnHeader = ({ title, count, bgColor, textColor }) => (
  <div className={`${bgColor} ${textColor} p-4 rounded-t-lg`}>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-sm opacity-90">{count} tasks</p>
  </div>
);

export default function TaskColumn({ title, tasks, bgColor, textColor, updateTaskStatus, updatingTasks, onCardClick }) {
  return (
    <div className="flex flex-col">
      <ColumnHeader 
        title={title}
        count={tasks.length}
        bgColor={bgColor}
        textColor={textColor}
      />
      <div className="max-h-[80vh] overflow-y-auto bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-4 flex-1">
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">No {title.toLowerCase()} tasks</div>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                updateTaskStatus={updateTaskStatus}
                updatingTasks={updatingTasks}
                onCardClick={onCardClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}