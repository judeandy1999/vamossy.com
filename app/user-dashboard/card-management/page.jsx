'use client';

import { useState } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useCards } from '@/hooks/useCards';
import { useUsers } from '@/hooks/useUsers';
import { Plus, Edit, Trash2, Save, X, Search, Filter, Users, User, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

// Risk x Reward Chart Component
const RiskRewardChart = ({ effort, reward, size = 'md' }) => {
  const chartSize = size === 'sm' ? 80 : size === 'lg' ? 120 : size === 'xl' ? 350 : 100;
  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : size === 'xl' ? 12 : 8;
  
  // Calculate position (0-10 scale to 0-100% position)
  const x = (effort / 10) * 100;
  const y = 100 - (reward / 10) * 100; // Invert Y axis so high reward is at top
  
  return (
    <div className="relative">
      <svg width={chartSize} height={chartSize} className="border border-gray-300 rounded">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Quadrant background colors */}
        <rect x="0" y="0" width="50%" height="50%" fill="#fef3c7" opacity="0.3" />
        <rect x="50%" y="0" width="50%" height="50%" fill="#d1fae5" opacity="0.3" />
        <rect x="0" y="50%" width="50%" height="50%" fill="#fecaca" opacity="0.3" />
        <rect x="50%" y="50%" width="50%" height="50%" fill="#fed7aa" opacity="0.3" />
        
        {/* Axes */}
        <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#6b7280" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100%" stroke="#6b7280" strokeWidth="1" />
        
        {/* Data point */}
        <circle 
          cx={`${x}%`} 
          cy={`${y}%`} 
          r={dotSize} 
          fill="#3b82f6" 
          stroke="#1d4ed8" 
          strokeWidth="2"
        />
      </svg>
      
      {/* Labels */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        Effort
      </div>
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-500">
        Reward
      </div>
    </div>
  );
};

// Card Detail Modal Component
const CardDetailModal = ({ card, isOpen, onClose, onEdit, onDelete, isAdmin, onNext, onPrev, hasNext, hasPrev, currentIndex, totalCards }) => {
  if (!card || !isOpen) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">{card.name}</h2>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {totalCards}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {card.category}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <p className="text-sm text-gray-600">{card.description || 'No description provided'}</p>
            </div>
            
            {card.comment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <p className="text-sm text-gray-600 italic">"{card.comment}"</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Users</label>
              <div className="flex flex-wrap gap-2">
                {card.effort_reward_card_assignments?.map((assignment, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <User className="h-3 w-3 mr-1" />
                    {assignment.user?.name || assignment.user?.email || 'Unknown User'}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-8 text-sm">
              <div className="text-center">
                <div className="font-medium text-gray-900 mb-1">Effort</div>
                <div className="text-3xl font-bold text-blue-600">{card.effort}/10</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 mb-1">Reward</div>
                <div className="text-3xl font-bold text-green-600">{card.reward}/10</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="mb-12">
              <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Risk vs Reward Matrix</h3>
              <RiskRewardChart effort={card.effort} reward={card.reward} size="xl" />
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => onEdit(card)}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => onDelete(card)}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

            {/* Navigation Buttons */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`absolute left-15 p-2 rounded-full bg-[#6c6c6c] transition-colors ${
            hasPrev 
              ? 'text-white bg-[#434040] hover:bg-[#000] cursor-pointer' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Previous card"
        >
          <ChevronLeft className="h-10 w-10" />
        </button>
        
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`absolute right-15 p-2 rounded-full bg-[#6c6c6c] transition-colors ${
            hasNext 
              ? 'text-white bg-[#434040] hover:bg-[#000] cursor-pointer' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Next card"
        >
          <ChevronRight className="h-10 w-10" />
        </button>
    </div>
  );
};

export default function CardManagement() {
  const { status } = useAuthWithRedirect();
  const { cards, loading, submitting, userRole, createCard, updateCard, deleteCard } = useCards();
  const { users } = useUsers();
  
  const [editingCard, setEditingCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    cardId: null,
    cardName: '',
    isLoading: false
  });
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    effort: 1,
    reward: 1,
    comment: '',
    assigned_user_ids: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      return;
    }

    if (formData.assigned_user_ids.length === 0) {
      return;
    }

    try {
      if (editingCard) {
        await updateCard(editingCard.id, formData);
      } else {
        await createCard(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        effort: 1,
        reward: 1,
        comment: '',
        assigned_user_ids: []
      });
      setEditingCard(null);
      setShowUserSelect(false);
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      category: card.category,
      description: card.description || '',
      effort: card.effort,
      reward: card.reward,
      comment: card.comment || '',
      assigned_user_ids: card.effort_reward_card_assignments?.map(a => a.user_id) || []
    });
    setShowUserSelect(false);
    setShowCardDetail(false);
  };

  const handleCancel = () => {
    setEditingCard(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      effort: 1,
      reward: 1,
      comment: '',
      assigned_user_ids: []
    });
    setShowUserSelect(false);
  };

  const handleDeleteClick = (card) => {
    setDeleteModal({
      isOpen: true,
      cardId: card.id,
      cardName: card.name,
      isLoading: false
    });
    setShowCardDetail(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      await deleteCard(deleteModal.cardId);
      setDeleteModal({
        isOpen: false,
        cardId: null,
        cardName: '',
        isLoading: false
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      cardId: null,
      cardName: '',
      isLoading: false
    });
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      assigned_user_ids: prev.assigned_user_ids.includes(userId)
        ? prev.assigned_user_ids.filter(id => id !== userId)
        : [...prev.assigned_user_ids, userId]
    }));
  };

  const handleCardClick = (card) => {
    const cardIndex = filteredCards.findIndex(c => c.id === card.id);
    setCurrentCardIndex(cardIndex);
    setSelectedCard(card);
    setShowCardDetail(true);
  };

  const handleNextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setSelectedCard(filteredCards[nextIndex]);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      const prevIndex = currentCardIndex - 1;
      setCurrentCardIndex(prevIndex);
      setSelectedCard(filteredCards[prevIndex]);
    }
  };

  const getEffortColor = (effort) => {
    if (effort <= 3) return 'bg-green-100 text-green-800';
    if (effort <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRewardColor = (reward) => {
    if (reward <= 3) return 'bg-red-100 text-red-800';
    if (reward <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAssignedUserNames = (assignments) => {
    if (!assignments || assignments.length === 0) return 'No assignments';
    
    return assignments.map(assignment => {
      const user = users.find(u => u.id === assignment.user_id);
      return user ? (user.name || user.email) : 'Unknown User';
    }).join(', ');
  };

  // Filter and search logic
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (card.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === '' || card.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(cards.map(card => card.category))];

  const isAdmin = userRole === 'admin';

  if (status === 'loading') {
    return <Spinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Card Management</h1>
          <p className="text-gray-600">Manage effort vs reward cards and assignments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Create/Edit Form (Admin Only) */}
        {isAdmin && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCard ? 'Edit Card' : 'Create New Card'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter card name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Effort (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.effort}
                      onChange={(e) => setFormData(prev => ({ ...prev, effort: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.reward}
                      onChange={(e) => setFormData(prev => ({ ...prev, reward: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a comment"
                  />
                </div>

                {/* User Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Users *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUserSelect(!showUserSelect)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {formData.assigned_user_ids.length === 0 ? 'Select users' : `${formData.assigned_user_ids.length} selected`}
                    </span>
                    <span className="text-gray-400">▼</span>
                  </button>
                  {showUserSelect && (
                    <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 bg-white">
                      {users
                        .filter(user => user.role !== 'admin')
                        .map((user) => (
                          <label key={user.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.assigned_user_ids.includes(user.id)}
                              onChange={() => handleUserToggle(user.id)}
                              className="cursor-pointer"
                            />
                            <span className="text-sm">
                              {user.name || user.email} 
                              <span className="text-xs text-gray-500 ml-1">({user.role})</span>
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                  {formData.assigned_user_ids.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.assigned_user_ids.length} user(s) selected
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  {editingCard && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2 inline" />
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingCard ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Right Column - Cards List */}
        <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {isAdmin ? 'All Cards' : 'My Cards'} ({filteredCards.length})
              </h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || filterCategory ? 'No cards match your search criteria.' : 
                   isAdmin ? 'No cards created yet. Create your first card!' : 'No cards assigned to you yet.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {card.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">{card.category}</p>
                        </div>
                        
                        {/* Quick Actions - Only for Admin */}
                        {isAdmin && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(card);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Edit Card"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(card);
                              }}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Risk x Reward Chart */}
                      <div className="flex justify-center mb-12">
                        <RiskRewardChart effort={card.effort} reward={card.reward} size="sm" />
                      </div>

                      {/* Effort and Reward badges */}
                      <div className="flex justify-center space-x-2 mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(card.effort)}`}>
                          Effort: {card.effort}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRewardColor(card.reward)}`}>
                          Reward: {card.reward}
                        </span>
                      </div>

                      {/* Assigned users */}
                      <div className="flex items-center justify-center mb-2">
                        <User className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-600 text-center">
                          {card.effort_reward_card_assignments?.length || 0} assigned
                        </span>
                      </div>

                      {card.description && (
                        <p className="text-xs text-gray-600 text-center line-clamp-2 mb-2">
                          {card.description}
                        </p>
                      )}

                      {/* View indicator */}
                      <div className="flex justify-center">
                        <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Click to view
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={showCardDetail}
        onClose={() => setShowCardDetail(false)}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onNext={handleNextCard}
        onPrev={handlePrevCard}
        hasNext={currentCardIndex < filteredCards.length - 1}
        hasPrev={currentCardIndex > 0}
        currentIndex={currentCardIndex}
        totalCards={filteredCards.length}
        isAdmin={isAdmin}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        target={{ type: 'card', name: deleteModal.cardName }}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}