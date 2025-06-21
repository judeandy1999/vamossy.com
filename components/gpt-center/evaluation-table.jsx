'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';
import { Calendar, Star, Filter, User, FileText } from 'lucide-react';

export default function EvaluationTable({ userRole }) {
  const { showToast } = useToast();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, daily, weekly, monthly
  const [sortBy, setSortBy] = useState('created_at'); // created_at, score, task_title

  useEffect(() => {
    fetchEvaluations();
  }, [filter, sortBy]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Calculate date filter
      let dateFilter = null;
      const now = new Date();
      
      switch (filter) {
        case 'daily':
          dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = weekAgo;
          break;
        case 'monthly':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFilter = monthAgo;
          break;
        default:
          dateFilter = null;
      }

      // Build query
      let query = supabase
        .from('evaluations')
        .select(`
          *,
          tasks (id, title, description),
          task_logs (id, log_content, file_url)
        `);

      // Add user filter (admin can see all, workers see only their own)
      if (userRole !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      // Add date filter
      if (dateFilter) {
        query = query.gte('created_at', dateFilter.toISOString());
      }

      // Add sorting
      query = query.order(sortBy, { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setEvaluations(data || []);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      showToast('Failed to load evaluations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreStars = (score) => {
    const stars = Math.round(score / 20); // Convert 0-100 to 0-5 stars
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Task Evaluations</h2>
        <span className="text-sm text-gray-500">{evaluations.length} evaluations</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="daily">Today</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Date</option>
            <option value="score">Score</option>
          </select>
        </div>
      </div>

      {/* Evaluations Grid */}
      {evaluations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No evaluations found</h3>
          <p className="mt-1 text-sm">Evaluations will appear here after you upload task logs.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                      View Detailed Feedback
                    </summary>
                    <div className="mt-2 space-y-2">
                      {evaluation.evaluator_response.parsed.strengths && (
                        <div>
                          <span className="font-medium text-green-700">Strengths:</span>
                          <p className="text-gray-600">{evaluation.evaluator_response.parsed.strengths}</p>
                        </div>
                      )}
                      {evaluation.evaluator_response.parsed.improvements && (
                        <div>
                          <span className="font-medium text-orange-700">Improvements:</span>
                          <p className="text-gray-600">{evaluation.evaluator_response.parsed.improvements}</p>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}