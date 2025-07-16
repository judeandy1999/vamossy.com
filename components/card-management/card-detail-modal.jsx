import { X, ChevronLeft, ChevronRight, Edit, Trash2, User } from 'lucide-react';
import RiskRewardChart from './risk-reward-chart';

export default function CardDetailModal({ 
  card, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  isAdmin, 
  onNext, 
  onPrev, 
  hasNext, 
  hasPrev, 
  currentIndex, 
  totalCards 
}) {
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
        className={`absolute left-15 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-colors ${
          hasPrev 
            ? 'text-white bg-gray-600 hover:bg-gray-800 cursor-pointer' 
            : 'text-gray-300 bg-gray-400 cursor-not-allowed'
        }`}
        title="Previous card"
      >
        <ChevronLeft className="h-10 w-10" />
      </button>
      
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`absolute right-15 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-colors ${
          hasNext 
            ? 'text-white bg-gray-600 hover:bg-gray-800 cursor-pointer' 
            : 'text-gray-300 bg-gray-400 cursor-not-allowed'
        }`}
        title="Next card"
      >
        <ChevronRight className="h-10 w-10" />
      </button>
    </div>
  );
}