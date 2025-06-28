// components/gpt-center/log-upload.jsx
'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/toast-context';
import { Upload, FileText, Send } from 'lucide-react';

export default function LogUpload({ tasks, uploadLog }) {
  const { showToast } = useToast();
  const [selectedTask, setSelectedTask] = useState('');
  const [logContent, setLogContent] = useState('');
  const [evaluationPrompt, setEvaluationPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const resetForm = () => {
    setSelectedTask('');
    setLogContent('');
    setEvaluationPrompt('');
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadLog) {
      showToast('Upload function not available', 'error');
      return;
    }

    setUploading(true);

    try {
      await uploadLog({
        taskId: selectedTask,
        logContent,
        evaluationPrompt,
        file: selectedFile
      });

      // Reset form on success
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Upload Task Log</h2>
        <p className="text-gray-600 mt-1">
          Upload your completed task log for evaluation and feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Task *
          </label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose a task...</option>
            {tasks?.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>

        {/* Log Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Log Content
          </label>
          <textarea
            value={logContent}
            onChange={(e) => setLogContent(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what you did, results achieved, insights gained, etc..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide details about how you completed the task, what tools you used, and any results or insights.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evaluation Prompt
          </label>
          <textarea
            value={evaluationPrompt}
            onChange={(e) => setEvaluationPrompt(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="How would you like the AI to evaluate your log? What specific aspects should it focus on?"
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide custom instructions for how you want the AI to evaluate your log.
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attach File (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".txt,.md,.pdf,.doc,.docx"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                TXT, MD, PDF, DOC up to 10MB
              </p>
            </div>
          </div>
          
          {selectedFile && (
            <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <FileText className="h-4 w-4 mr-2" />
              <span className="flex-1">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
              <button
                type="button"
                onClick={removeFile}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
<<<<<<< HEAD
            className="bg-blue-600 text-gray-300 px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
=======
            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
>>>>>>> main
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Send className="cursor-pointer h-4 w-4 mr-2" />
                Upload Log
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}