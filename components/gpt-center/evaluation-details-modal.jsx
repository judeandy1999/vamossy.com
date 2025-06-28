'use client';

import { X, Star, FileText, Calendar, User, Target } from 'lucide-react';

export default function EvaluationDetailsModal({ evaluation, isOpen, onClose }) {
  if (!isOpen || !evaluation) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
        {score}/100
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Evaluation Details</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Task Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Task Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {evaluation.tasks?.title || 'Unknown Task'}
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                {evaluation.tasks?.description || 'No description available'}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Evaluated on {formatDate(evaluation.created_at)}
              </div>
            </div>
          </div>

          {/* Score Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Score</h3>
            <div className="flex items-center gap-4">
              {getScoreBadge(evaluation.score)}
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(evaluation.score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className={`text-lg font-semibold ${getScoreColor(evaluation.score)}`}>
                {evaluation.score}/100
              </span>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Feedback</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {evaluation.feedback || 'No feedback provided'}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          {evaluation.evaluator_response?.parsed && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Strengths */}
              {evaluation.evaluator_response.parsed.strengths && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                  <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                    <p className="text-green-800 text-sm">
                      {evaluation.evaluator_response.parsed.strengths}
                    </p>
                  </div>
                </div>
              )}

              {/* Areas for Improvement */}
              {evaluation.evaluator_response.parsed.improvements && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                  <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                    <p className="text-orange-800 text-sm">
                      {evaluation.evaluator_response.parsed.improvements}
                    </p>
                  </div>
                </div>
              )}

              {/* Completeness */}
              {evaluation.evaluator_response.parsed.completeness && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-2">Completeness Assessment</h4>
                  <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                    <p className="text-blue-800 text-sm">
                      {evaluation.evaluator_response.parsed.completeness}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Log Content */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Submitted Log
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border">
              {evaluation.task_logs?.log_content ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Content:</h4>
                    <p className="text-gray-600 whitespace-pre-wrap text-sm max-h-40 overflow-y-auto">
                      {evaluation.task_logs.log_content}
                    </p>
                  </div>
                  
                  {evaluation.task_logs.file_url && (
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Attached File:</h4>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {evaluation.task_logs.file_name || 'Uploaded file'}
                        </span>
                        {evaluation.task_logs.file_size && (
                          <span className="text-xs text-gray-500">
                            ({(evaluation.task_logs.file_size / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No log content available</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}