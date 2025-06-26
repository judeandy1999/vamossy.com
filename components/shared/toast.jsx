'use client';

import { useToast } from '@/contexts/toast-context';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useToast();

  if (!toast.visible) return null;

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ease-in-out ${getToastStyles(toast.type)}`}
      style={{ minWidth: '300px', maxWidth: '500px' }}
    >
      {getIcon(toast.type)}
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={hideToast}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
