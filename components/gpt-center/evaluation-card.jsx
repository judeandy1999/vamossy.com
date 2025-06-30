'use client';

import { Calendar, Star, FileText, Trash2 } from 'lucide-react';

export default function EvaluationCard({ evaluation, onCardClick, onDelete }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreStars = (score) => {
    const stars = Math.round(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
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

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(evaluation);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(evaluation.id);
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 relative"
      onClick={handleCardClick}
    >

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {evaluation.tasks?.title || 'Unknown Task'}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(evaluation.created_at)}
          </p>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(evaluation.score)}`}>
          {evaluation.score}/100
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="ml-2 mt-1 text-red-500 hover:text-red-700 transition-colors"
            title="Delete Evaluation"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Score Stars */}
      <div className="flex items-center gap-1 mb-3">
        {getScoreStars(evaluation.score)}
        <span className="text-xs text-gray-500 ml-1">
          ({evaluation.score}/100)
        </span>
      </div>

      {/* Feedback Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">
          {evaluation.feedback || 'No feedback provided'}
        </p>
      </div>

      {/* Task Info */}
      <div className="text-xs text-gray-500 border-t pt-3">
        <p className="truncate">
          Task: {evaluation.tasks?.description || 'No description'}
        </p>
        {evaluation.task_logs?.file_url && (
          <p className="flex items-center gap-1 mt-1">
            <FileText size={10} />
            File attached
          </p>
        )}
      </div>

      {/* Detailed Feedback (if available) */}
      {evaluation.evaluator_response?.parsed && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs">
            <span className="text-blue-600 font-medium">
              Click to view detailed feedback
            </span>
          </div>
        </div>
      )}
    </div>
  );
}