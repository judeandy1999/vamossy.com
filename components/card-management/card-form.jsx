import { Save, X, Users } from 'lucide-react';

export default function CardForm({ 
  editingCard, 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  submitting, 
  users, 
  showUserSelect, 
  setShowUserSelect, 
  onUserToggle 
}) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingCard ? 'Edit Card' : 'Create New Card'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
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
                        onChange={() => onUserToggle(user.id)}
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
                onClick={onCancel}
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
  );
}