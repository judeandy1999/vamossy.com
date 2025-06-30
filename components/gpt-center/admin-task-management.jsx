'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/toast-context';
import TaskDetailsModal from './task-details-modal';
import EditTaskModal from './edit-task-modal';
import Modal from '@/components/ui/modal';
import EvaluationDetailsModal from './evaluation-details-modal';
import Spinner from '@/components/ui/spinner';
import AdminHeader from './admin-header';
import SectionTabs from './admin-section-tabs';
import TasksSection from './admin-tasks-section';
import EvaluationsSection from './admin-evaluations-section';

export default function AdminTaskManagement({ 
  allTasks,
  updateTaskStatus, 
  updatingTasks, 
  deleteTask, 
  updateTask,
  fetchAllTasks,
  evaluations,
  fetchEvaluations,
  evaluationLoading,
  deleteEvaluation
}) {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('tasks');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [evaluationFilter, setEvaluationFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [userEvaluationFilter, setUserEvaluationFilter] = useState('all');
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isDeleteEvaluationModalOpen, setIsDeleteEvaluationModalOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);
  const [deletingEvaluation, setDeletingEvaluation] = useState(false);

  useEffect(() => {
    if (!hasInitialized && allTasks.length === 0) {
      setHasInitialized(true);
      const loadData = async () => {
        setLoading(true);
        try {
          await fetchAllTasks();
          await fetchEvaluations('all', 'created_at');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [hasInitialized, allTasks.length]);

  useEffect(() => {
    let filtered = allTasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (frequencyFilter !== 'all') {
      filtered = filtered.filter(task => task.frequency === frequencyFilter);
    }

    if (userFilter !== 'all') {
      filtered = filtered.filter(task => task.assigned_user_id === userFilter);
    }

    setFilteredTasks(filtered);
  }, [allTasks, searchTerm, statusFilter, frequencyFilter, userFilter]);

  useEffect(() => {
    let filtered = evaluations || [];

    if (searchTerm) {
      filtered = filtered.filter(evaluation => 
        evaluation.tasks?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.tasks?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.task_logs?.log_content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (evaluationFilter !== 'all') {
      const now = new Date();
      let dateFilter = null;
      
      switch (evaluationFilter) {
        case 'daily':
          dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      if (dateFilter) {
        filtered = filtered.filter(evaluation => 
          new Date(evaluation.created_at) >= dateFilter
        );
      }
    }

    if (scoreFilter !== 'all') {
      const [min, max] = scoreFilter.split('-').map(Number);
      filtered = filtered.filter(evaluation => 
        evaluation.score >= min && evaluation.score <= max
      );
    }

    if (userEvaluationFilter !== 'all') {
      filtered = filtered.filter(evaluation => 
        evaluation.user_id === userEvaluationFilter
      );
    }

    setFilteredEvaluations(filtered);
  }, [evaluations, searchTerm, evaluationFilter, scoreFilter, userEvaluationFilter]);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      showToast('Task deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const confirmDeleteEvaluation = async () => {
    if (!evaluationToDelete) return;
    setDeletingEvaluation(true);
    try {
      await deleteEvaluation(evaluationToDelete.id);
      setIsDeleteEvaluationModalOpen(false);
      setEvaluationToDelete(null);
    } catch (error) {
    } finally {
      setDeletingEvaluation(false);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      showToast('Task updated successfully', 'success');
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Failed to update task', 'error');
    }
  };

  const handleViewEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEvaluationModalOpen(true);
  };

  const handleDeleteEvaluation = (evaluation) => {
    setEvaluationToDelete(evaluation);
    setIsDeleteEvaluationModalOpen(true);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchAllTasks();
      await fetchEvaluations('all', 'created_at');
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueUsers = [...new Map(
    allTasks
      .filter(task => task.users)
      .map(task => [task.assigned_user_id, task.users])
  ).values()];

  const uniqueFrequencies = [...new Set(allTasks.map(task => task.frequency))].filter(Boolean);

  const uniqueEvaluationUsers = [...new Map(
    (evaluations || [])
      .filter(evaluation => evaluation.users)
      .map(evaluation => [evaluation.user_id, evaluation.users])
  ).values()];

  if (loading && allTasks.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <AdminHeader loading={loading} onRefresh={handleRefresh} />
      
      <SectionTabs 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        filteredTasksCount={filteredTasks.length}
        filteredEvaluationsCount={filteredEvaluations.length}
      />

      {activeSection === 'tasks' && (
        <TasksSection
          filteredTasks={filteredTasks}
          allTasks={allTasks}
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
          onViewTask={handleViewTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {activeSection === 'evaluations' && (
        <EvaluationsSection
          filteredEvaluations={filteredEvaluations}
          evaluations={evaluations}
          evaluationLoading={evaluationLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          userEvaluationFilter={userEvaluationFilter}
          setUserEvaluationFilter={setUserEvaluationFilter}
          evaluationFilter={evaluationFilter}
          setEvaluationFilter={setEvaluationFilter}
          scoreFilter={scoreFilter}
          setScoreFilter={setScoreFilter}
          uniqueEvaluationUsers={uniqueEvaluationUsers}
          onViewEvaluation={handleViewEvaluation}
          onDeleteEvaluation={handleDeleteEvaluation}
        />
      )}

      {/* Modals */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTask(null);
        }}
        updateTaskStatus={updateTaskStatus}
        updatingTasks={updatingTasks}
        isButtonDisplayed={false}
      />

      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
      />

      <EvaluationDetailsModal
        evaluation={selectedEvaluation}
        isOpen={isEvaluationModalOpen}
        onClose={() => {
          setIsEvaluationModalOpen(false);
          setSelectedEvaluation(null);
        }}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
        target={{ type: 'task', name: taskToDelete?.title }}
        isLoading={deleting}
      />

      <Modal
        isOpen={isDeleteEvaluationModalOpen}
        onClose={() => {
          setIsDeleteEvaluationModalOpen(false);
          setEvaluationToDelete(null);
        }}
        onConfirm={confirmDeleteEvaluation}
        target={{ type: 'evaluation', name: evaluationToDelete?.tasks?.title || 'Evaluation' }}
        isLoading={deletingEvaluation}
      />
    </div>
  );
}