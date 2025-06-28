'use client';

export default function AdminTaskStatistics({ filteredTasks }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Task Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Status Statistics */}
        <div className="text-center p-3 border border-gray-200 rounded-lg bg-blue-50">
          <p className="text-sm font-medium text-blue-900">Pending</p>
          <p className="text-lg font-bold text-blue-600">
            {filteredTasks.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="text-center p-3 border border-gray-200 rounded-lg bg-yellow-50">
          <p className="text-sm font-medium text-yellow-900">In Progress</p>
          <p className="text-lg font-bold text-yellow-600">
            {filteredTasks.filter(t => t.status === 'in_progress').length}
          </p>
        </div>
        <div className="text-center p-3 border border-gray-200 rounded-lg bg-green-50">
          <p className="text-sm font-medium text-green-900">Completed</p>
          <p className="text-lg font-bold text-green-600">
            {filteredTasks.filter(t => t.status === 'completed').length}
          </p>
        </div>
        <div className="text-center p-3 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-900">Total Tasks</p>
          <p className="text-lg font-bold text-gray-600">
            {filteredTasks.length}
          </p>
        </div>
      </div>
    </div>
  );
}