'use client';

import { X, Calendar, Star, FileText, User, Clock, Target, TrendingUp, AlertCircle } from 'lucide-react';

export default function EvaluationDetailsModal({ evaluation, isOpen, onClose }) {
  if (!isOpen || !evaluation) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreStars = (score) => {
    const stars = Math.round(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    if (score >= 60) return 'Below Average';
    return 'Needs Improvement';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex backdrop-blur-xs bg-black/20 items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Evaluation Details</h3>
              <button
                onClick={onClose}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6 max-h-[80vh] overflow-y-auto">
            {/* Score Section */}
            <div className={`mb-6 p-6 rounded-lg border ${getScoreColor(evaluation.score)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{evaluation.score}/100</h2>
                  <p className="text-sm font-medium">{getScoreLabel(evaluation.score)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getScoreStars(evaluation.score)}
                </div>
              </div>
            </div>

            {/* Task Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Task Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Task Title:</span>
                  <p className="text-gray-900">{evaluation.tasks?.title || 'Unknown Task'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Description:</span>
                  <p className="text-gray-900">{evaluation.tasks?.description || 'No description provided'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Task ID:</span>
                    <p className="text-gray-900 font-mono text-sm">{evaluation.task_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Timeline */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Evaluated on:</span>
                    <p className="text-gray-900">{formatDate(evaluation.created_at)}</p>
                  </div>
                </div>
                {evaluation.task_logs?.created_at && (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Log submitted on:</span>
                      <p className="text-gray-900">{formatDate(evaluation.task_logs.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* File Information */}
            {evaluation.task_logs?.file_url && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Submitted File
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {evaluation.task_logs.file_name || 'Uploaded File'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Size: {formatFileSize(evaluation.task_logs.file_size)}
                      </p>
                    </div>
                    <a
                      href={evaluation.task_logs.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View File
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* General Feedback */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Feedback Summary
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">
                  {evaluation.feedback || 'No general feedback provided'}
                </p>
              </div>
            </div>

            {/* Detailed Evaluation Response */}
            {evaluation.evaluator_response?.parsed && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Detailed Analysis
                </h4>
                
                <div className="space-y-4">
                  {/* Strengths */}
                  {evaluation.evaluator_response.parsed.strengths && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="text-md font-semibold text-green-800 mb-2 flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Strengths
                      </h5>
                      <p className="text-green-700 leading-relaxed">
                        {evaluation.evaluator_response.parsed.strengths}
                      </p>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {evaluation.evaluator_response.parsed.improvements && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h5 className="text-md font-semibold text-orange-800 mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Areas for Improvement
                      </h5>
                      <p className="text-orange-700 leading-relaxed">
                        {evaluation.evaluator_response.parsed.improvements}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {evaluation.evaluator_response.parsed.recommendations && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="text-md font-semibold text-blue-800 mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Recommendations
                      </h5>
                      <p className="text-blue-700 leading-relaxed">
                        {evaluation.evaluator_response.parsed.recommendations}
                      </p>
                    </div>
                  )}

                  {/* Additional Comments */}
                  {evaluation.evaluator_response.parsed.comments && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Additional Comments
                      </h5>
                      <p className="text-gray-700 leading-relaxed">
                        {evaluation.evaluator_response.parsed.comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Raw Response (for debugging/complete info) */}
            {evaluation.evaluator_response?.raw_response && (
              <div className="mb-6">
                <details className="bg-gray-50 rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    View Complete Evaluator Response
                  </summary>
                  <div className="mt-3 p-3 bg-white rounded border text-xs">
                    <pre className="whitespace-pre-wrap text-gray-600">
                      {evaluation.evaluator_response.raw_response}
                    </pre>
                  </div>
                </details>
              </div>
            )}

            {/* Evaluation ID */}
            <div className="text-xs text-gray-400 border-t pt-4">
              Evaluation ID: {evaluation.id}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}