'use client';

import { Eye, User, Calendar, FileText, Star, Trash2 } from 'lucide-react';

export default function AdminEvaluationsTable({ 
  filteredEvaluations, 
  evaluations, 
  evaluationLoading, 
  onViewEvaluation,
  onDeleteEvaluation
}) {
  const getScoreBadge = (score) => {
    let bgColor, textColor;
    if (score >= 90) {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else if (score >= 80) {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
    } else if (score >= 70) {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
    } else if (score >= 60) {
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
    } else {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {score}/100
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feedback Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Log Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evaluated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evaluationLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Loading evaluations...
                </td>
              </tr>
            ) : filteredEvaluations.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  {evaluations?.length === 0 ? 'No evaluations found' : 'No evaluations match your filters'}
                </td>
              </tr>
            ) : (
              filteredEvaluations.map((evaluation) => (
                <tr key={evaluation.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onViewEvaluation(evaluation)}>
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {evaluation.users?.name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {evaluation.users?.email || 'No email'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {evaluation.users?.role || 'worker'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Task Info */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[10rem]">
                        {evaluation.tasks?.title || 'Unknown Task'}
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4">
                    {getScoreBadge(evaluation.score)}
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.round(evaluation.score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Feedback Preview */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-[10rem] truncate">
                      {evaluation.feedback || 'No feedback provided'}
                    </div>
                  </td>

                  {/* Log Content */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {evaluation.task_logs?.log_content ? (
                        <div className="max-w-[10rem] truncate">
                          {evaluation.task_logs.log_content}
                        </div>
                      ) : (
                        'No content'
                      )}
                      {evaluation.task_logs?.file_url && (
                        <div className="flex items-center mt-1 text-xs text-blue-600">
                          <FileText className="h-3 w-3 mr-1" />
                          File attached
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Evaluated Date */}
                  <td className="px-6 py-4 min-w-[10rem]">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-5 w-5 mr-1" />
                      {formatDate(evaluation.created_at)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewEvaluation(evaluation)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors mr-2"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvaluation?.(evaluation);
                      }}
                      className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Evaluation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}