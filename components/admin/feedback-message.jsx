'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';

export default function FeedbackMessage({ feedback }) {
  if (!feedback.message) return null;

  return (
    <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
      feedback.type === 'success' 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {feedback.type === 'success' ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      {feedback.message}
    </div>
  );
}
