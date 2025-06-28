'use client';

import AdminEvaluationFilters from './admin-evaluation-filters';
import AdminEvaluationsTable from './admin-evaluations-table';

export default function EvaluationsSection({
  filteredEvaluations,
  evaluations,
  evaluationLoading,
  searchTerm,
  setSearchTerm,
  userEvaluationFilter,
  setUserEvaluationFilter,
  evaluationFilter,
  setEvaluationFilter,
  scoreFilter,
  setScoreFilter,
  uniqueEvaluationUsers,
  onViewEvaluation
}) {
  return (
    <>
      <AdminEvaluationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        userEvaluationFilter={userEvaluationFilter}
        setUserEvaluationFilter={setUserEvaluationFilter}
        evaluationFilter={evaluationFilter}
        setEvaluationFilter={setEvaluationFilter}
        scoreFilter={scoreFilter}
        setScoreFilter={setScoreFilter}
        uniqueEvaluationUsers={uniqueEvaluationUsers}
      />

      {/* Results Summary */}
      <div className="justify-self-end w-fit bg-white px-4 py-2 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {filteredEvaluations.length} of {evaluations?.length || 0} evaluations
        </p>
      </div>

      <AdminEvaluationsTable
        filteredEvaluations={filteredEvaluations}
        evaluations={evaluations}
        evaluationLoading={evaluationLoading}
        onViewEvaluation={onViewEvaluation}
      />
    </>
  );
}