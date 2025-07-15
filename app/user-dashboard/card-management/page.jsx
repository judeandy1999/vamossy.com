'use client';

import { useState } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useCards } from '@/hooks/useCards';
import { useUsers } from '@/hooks/useUsers';
import { Plus, Edit, Trash2, Save, X, Search, Filter, Users, User } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

export default function CardManagement() {
  const { status } = useAuthWithRedirect();
  const { cards, loading, submitting, userRole, createCard, updateCard, deleteCard } = useCards();
  const { users } = useUsers();
  
  const [editingCard, setEditingCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showUserSelect, setShowUserSelect] = useState(false);
  
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
      // Error handling is done in the hook
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
    setShowUserSelect(true);
  };

  const handleDeleteClick = (card) => {
    setDeleteModal({
      isOpen: true,
      cardId: card.id,
      cardName: card.name,
      isLoading: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.cardId) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      await deleteCard(deleteModal.cardId);
      
      // Close modal on success
      setDeleteModal({
        isOpen: false,
        cardId: null,
        cardName: '',
        isLoading: false
      });
    } catch (error) {
      // Error handling is done in the hook, just stop loading
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      assigned_user_ids: prev.assigned_user_ids.includes(userId)
        ? prev.assigned_user_ids.filter(id => id !== userId)
        : [...prev.assigned_user_ids, userId]
    }));
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
      <div className="flex mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Card Management' : 'My Assigned Cards'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin 
              ? 'Create and manage reward x effort cards for your team'
              : 'View and work on cards assigned to you'
            }
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-2' : ''} gap-8`}>
        {/* Left Column - Form (Only for Admin) */}
        {isAdmin && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                {editingCard ? (
                  <>
                    <Edit className="h-5 w-5 mr-2 text-blue-600" />
                    Edit Card
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2 text-green-600" />
                    Create New Card
                  </>
                )}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter card name..."
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the card..."
                  />
                </div>

                {/* Effort and Reward */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Effort (1-10)
                    </label>
                    <input
                      type="number"
                      name="effort"
                      value={formData.effort}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward (1-10)
                    </label>
                    <input
                      type="number"
                      name="reward"
                      value={formData.reward}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional comments..."
                  />
                </div>

                {/* User Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Assign To Users *
                  </label>
                  {!showUserSelect ? (
                    <button
                      type="button"
                      onClick={() => setShowUserSelect(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      Click to select users...
                    </button>
                  ) : (
                    <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
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
        <div className="space-y-6">
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

          {/* Cards List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {isAdmin ? 'All Cards' : 'My Cards'} ({filteredCards.length})
              </h2>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
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
                <div className="divide-y divide-gray-200">
                  {filteredCards.map((card) => (
                    <div key={card.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {card.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">{card.category}</p>
                          
                          {/* Effort and Reward badges */}
                          <div className="flex space-x-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(card.effort)}`}>
                              Effort: {card.effort}/10
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRewardColor(card.reward)}`}>
                              Reward: {card.reward}/10
                            </span>
                          </div>

                          {/* Assigned users */}
                          <div className="flex items-center mb-2">
                            <User className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-600">
                              {getAssignedUserNames(card.effort_reward_card_assignments)}
                            </span>
                          </div>

                          {card.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {card.description}
                            </p>
                          )}

                          {card.comment && (
                            <p className="text-xs text-gray-500 italic">
                              "{card.comment}"
                            </p>
                          )}
                        </div>

                        {/* Actions - Only for Admin */}
                        {isAdmin && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEdit(card)}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Edit Card"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(card)}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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