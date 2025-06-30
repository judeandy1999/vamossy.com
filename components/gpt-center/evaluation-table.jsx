'use client';

import { useState, useEffect } from 'react';
import { Filter, FileText } from 'lucide-react';
import Spinner from '../ui/spinner';
import EvaluationCard from './evaluation-card';
import EvaluationDetailsModal from './evaluation-details-modal';
import Modal from '@/components/ui/modal';

export default function EvaluationTable({ evaluations, fetchEvaluations, loading, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (fetchEvaluations) {
      fetchEvaluations(filter, sortBy);
    }
  }, [fetchEvaluations]);

  const handleCardClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvaluation(null);
  };

  const handleDelete = (evaluation) => {
    setEvaluationToDelete(evaluation);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!evaluationToDelete) return;
    setDeleting(true);
    try {
      await onDelete(evaluationToDelete);
      setIsDeleteModalOpen(false);
      setEvaluationToDelete(null);
    } catch (error) {
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Task Evaluations</h2>
        <span className="text-sm text-gray-500">{evaluations?.length || 0} evaluations</span>
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
      {!evaluations || evaluations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No evaluations found</h3>
          <p className="mt-1 text-sm">Evaluations will appear here after you upload task logs.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {evaluations.map((evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              onCardClick={handleCardClick}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Evaluation Details Modal */}
      <EvaluationDetailsModal
        evaluation={selectedEvaluation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEvaluationToDelete(null);
        }}
        onConfirm={confirmDelete}
        target={{
          type: 'evaluation',
          name: evaluationToDelete?.tasks?.title || 'Evaluation'
        }}
        isLoading={deleting}
      />
    </div>
  );
}