'use client';

import { Play, CheckCircle } from 'lucide-react';

export default function TaskButton({ task, onAction, isUpdating, canRestart }) {
  const assignment = Array.isArray(task.task_assignments) ? task.task_assignments[0] : null;
  const status = assignment?.status;

  const getButtonContent = () => {
    if (isUpdating) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
          Updating...
        </>
      );
    }

    if (status === 'completed' && canRestart) {
      return (
        <>
          <Play className="h-4 w-4 mr-1" />
          Start Again
        </>
      );
    }

    if (status === 'completed') {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-1" />
          Completed
        </>
      );
    }

    if (status === 'in_progress') {
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

  const getButtonStyle = () => {
    if (status === 'completed' && !canRestart) {
      return "cursor-pointer w-full bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium cursor-not-allowed disabled:opacity-50 flex items-center justify-center";
    }

    if (status === 'completed' && canRestart) {
      return "cursor-pointer w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    }

    if (status === 'in_progress') {
      return "cursor-pointer w-full bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    }

    return "cursor-pointer w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  };

  const isDisabled = isUpdating || (status === 'completed' && !canRestart);

  return (
    <button
      onClick={onAction}
      disabled={isDisabled}
      className={getButtonStyle()}
    >
      {getButtonContent()}
    </button>
  );
}