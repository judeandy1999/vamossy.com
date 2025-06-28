'use client';

export default function SectionTabs({ 
  activeSection, 
  setActiveSection, 
  filteredTasksCount, 
  filteredEvaluationsCount 
}) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveSection('tasks')}
          className={`cursor-pointer py-2 px-1 border-b-2 font-medium text-sm ${
            activeSection === 'tasks'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Tasks ({filteredTasksCount})
        </button>
        <button
          onClick={() => setActiveSection('evaluations')}
          className={`cursor-pointer py-2 px-1 border-b-2 font-medium text-sm ${
            activeSection === 'evaluations'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Logs & Evaluations ({filteredEvaluationsCount})
        </button>
      </nav>
    </div>
  );
}