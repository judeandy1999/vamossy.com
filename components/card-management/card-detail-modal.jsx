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
}) {
  if (!card || !isOpen) return null;

  const getScoreColor = (score, type) => {
    if (type === 'effort') {
      // High effort = Red (harder), Low effort = Green (easier)
      if (score <= 3) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      if (score <= 6) return 'text-amber-700 bg-amber-50 border-amber-200';
      return 'text-red-700 bg-red-50 border-red-200';
    } else {
      // High reward = Green (better), Low reward = Red (worse)
      if (score <= 3) return 'text-red-700 bg-red-50 border-red-200';
      if (score <= 6) return 'text-amber-700 bg-amber-50 border-amber-200';
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  const getScoreLabel = (score, type) => {
    if (type === 'effort') {
      if (score <= 3) return 'Low Effort';
      if (score <= 6) return 'Medium Effort';
      return 'High Effort';
    } else {
      if (score <= 3) return 'Low Reward';
      if (score <= 6) return 'Medium Reward';
      return 'High Reward';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Main Modal - Takes up most of the screen */}
      <div className="bg-white rounded-lg shadow-2xl w-[90vw] h-[85vh] max-w-7xl mx-4 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{card.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-200 text-slate-800">
                  {card.category}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-white hover:text-slate-300 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Side - Scorecard */}
            <div className="bg-slate-50 p-8 flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Scorecard Analysis</h2>
                <p className="text-slate-600">Risk vs Reward Matrix</p>
              </div>

              {/* Large Chart */}
              <div className="mb-8">
                <RiskRewardChart effort={card.effort} reward={card.reward} size="xl" />
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-700 mb-2">Effort Score</div>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold border-2 ${getScoreColor(card.effort, 'effort')}`}>
                    {card.effort}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">{getScoreLabel(card.effort, 'effort')}</div>
                  <div className="text-xs text-slate-500 mt-1">out of 10</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-700 mb-2">Reward Score</div>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold border-2 ${getScoreColor(card.reward, 'reward')}`}>
                    {card.reward}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">{getScoreLabel(card.reward, 'reward')}</div>
                  <div className="text-xs text-slate-500 mt-1">out of 10</div>
                </div>
              </div>

              {/* Paging Controls - Prominent placement */}
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={`absolute left-15 top-1/2 p-3 rounded-full font-medium transition-colors ${
                  hasPrev 
                    ? 'bg-slate-700 text-white hover:bg-slate-800 cursor-pointer' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                title="Previous card"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              
              <button
                onClick={onNext}
                disabled={!hasNext}
                className={`absolute right-15 top-1/2 p-3 rounded-full font-medium transition-colors ${
                  hasNext 
                    ? 'bg-slate-700 text-white hover:bg-slate-800 cursor-pointer' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                title="Next card"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </div>

            {/* Right Side - Information */}
            <div className="p-8 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Project Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-slate-700">{card.description || 'No description provided'}</p>
                      </div>
                    </div>
                    
                    {card.comment && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Comments</label>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                          <p className="text-slate-700 italic">"{card.comment}"</p>
                        </div>
                      </div>
                    )}

                    {/* Analysis Summary */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Analysis Summary</label>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">{card.effort}</div>
                            <div className="text-sm text-slate-600">Effort Required</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">{card.reward}</div>
                            <div className="text-sm text-slate-600">Expected Reward</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="text-sm text-slate-600">
                            <strong>Ratio:</strong> {(card.reward / card.effort).toFixed(2)}:1 
                            <span className="ml-2 text-slate-500">
                              ({card.reward > card.effort ? 'Favorable' : card.reward === card.effort ? 'Balanced' : 'Challenging'})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        {isAdmin && (
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => onEdit(card)}
                className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Card
              </button>
              <button
                onClick={() => onDelete(card)}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors cursor-pointer border border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Card
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}