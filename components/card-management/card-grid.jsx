import { Search, Filter, Edit, Trash2, User, Eye } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import RiskRewardChart from './risk-reward-chart';

export default function CardGrid({ 
  filteredCards, 
  categories, 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  loading, 
  isAdmin, 
  onCardClick, 
  onEdit, 
  onDelete, 
  getEffortColor, 
  getRewardColor 
}) {
  return (
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
                  onClick={() => onCardClick(card)}
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
                            onEdit(card);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Edit Card"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(card);
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
                  <div className="flex justify-center mb-10">
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
  );
}