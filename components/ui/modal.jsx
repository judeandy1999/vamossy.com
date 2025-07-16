export default function Modal({ isOpen, onClose, onConfirm, target, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this {target.type}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
            disabled={isLoading} // Disable button while loading
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center gap-2 min-w-[80px] h-[40px] ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}