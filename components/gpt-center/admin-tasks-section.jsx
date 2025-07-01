'use client';

import AdminTaskFilters from './admin-task-filters';
import AdminTaskStatistics from './admin-task-statistics';
import AdminTasksTable from './admin-tasks-table';

export default function TasksSection({
  filteredTasks,
  allTasks,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  frequencyFilter,
  setFrequencyFilter,
  userFilter,
  setUserFilter,
  uniqueUsers,
  uniqueFrequencies,
  onViewTask,
  onEditTask,
  onDeleteTask
}) {
  return (
    <>
      <AdminTaskFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        frequencyFilter={frequencyFilter}
        setFrequencyFilter={setFrequencyFilter}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        uniqueUsers={uniqueUsers}
        uniqueFrequencies={uniqueFrequencies}
      />

      {/* Task Results Summary */}
      {/* <div className="justify-self-end w-fit bg-white px-4 py-2 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {filteredTasks.length} of {allTasks.length} tasks
        </p>
      </div>

      <AdminTaskStatistics filteredTasks={filteredTasks} /> */}

      <AdminTasksTable
        filteredTasks={filteredTasks}
        allTasks={allTasks}
        onViewTask={onViewTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </>
  );
}