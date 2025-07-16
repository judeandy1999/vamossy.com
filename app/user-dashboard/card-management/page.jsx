'use client';

import { useState } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useCards } from '@/hooks/useCards';
import { useUsers } from '@/hooks/useUsers';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';
import CardForm from '@/components/card-management/card-form';
import CardGrid from '@/components/card-management/card-grid';
import CardDetailModal from '@/components/card-management/card-detail-modal';

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
          <CardForm
            editingCard={editingCard}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
            users={users}
            showUserSelect={showUserSelect}
            setShowUserSelect={setShowUserSelect}
            onUserToggle={handleUserToggle}
          />
        )}

        {/* Right Column - Cards List */}
        <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <CardGrid
            filteredCards={filteredCards}
            categories={categories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            loading={loading}
            isAdmin={isAdmin}
            onCardClick={handleCardClick}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            getEffortColor={getEffortColor}
            getRewardColor={getRewardColor}
          />
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