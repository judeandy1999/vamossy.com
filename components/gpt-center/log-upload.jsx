// components/gpt-center/log-upload.jsx
'use client';

import { useState } from 'react';
import { supabase } from '@/utils/client';
import { useToast } from '@/contexts/toast-context';
import { Upload, FileText, Send } from 'lucide-react';

export default function LogUpload({ tasks }) {
  const { showToast } = useToast();
  const [selectedTask, setSelectedTask] = useState('');
  const [logContent, setLogContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'text/plain', 
        'text/markdown', 
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (file.size > maxSize) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        showToast('Invalid file type. Please upload text, markdown, PDF, or Word documents.', 'error');
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadFile = async (file) => {
    const fileName = `logs/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('task-logs')
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTask) {
      showToast('Please select a task', 'error');
      return;
    }

    if (!logContent.trim() && !selectedFile) {
      showToast('Please provide log content or upload a file', 'error');
      return;
    }

    setUploading(true);

    try {
      // Get current session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Not authenticated');
      }

      const user = session.user;
      let fileUrl = null;

      // Upload file if selected
      if (selectedFile) {
        try {
          fileUrl = await uploadFile(selectedFile);
          console.log('File uploaded:', fileUrl);
        } catch (fileError) {
          console.error('File upload error:', fileError);
          showToast('Failed to upload file, but will save log content', 'warning');
        }
      }

      // Insert log record
      console.log('Inserting log record...');
      const { data: logData, error: logError } = await supabase
        .from('task_logs')
        .insert({
          task_id: parseInt(selectedTask),
          user_id: user.id,
          log_content: logContent.trim() || null,
          file_url: fileUrl
        })
        .select()
        .single();

      if (logError) {
        console.error('Log insert error:', logError);
        throw logError;
      }

      console.log('Log saved successfully:', logData.id);

      // Trigger evaluation with proper authentication
      console.log('Triggering evaluation...');
      try {
        const evaluationResponse = await fetch('/api/gpt-center/evaluate-log', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
          body: JSON.stringify({
            logId: logData.id,
            taskId: parseInt(selectedTask),
            logContent: logContent.trim(),
            fileUrl
          })
        });

        if (evaluationResponse.ok) {
          const evaluationResult = await evaluationResponse.json();
          console.log('Evaluation completed:', evaluationResult);
          showToast('Log uploaded and evaluated successfully!', 'success');
        } else {
          const errorData = await evaluationResponse.json().catch(() => ({}));
          console.error('Evaluation failed:', errorData);
          showToast('Log uploaded, but evaluation failed. You can still view it in the evaluations tab.', 'warning');
        }
      } catch (evalError) {
        console.error('Evaluation request error:', evalError);
        showToast('Log uploaded, but evaluation service is unavailable.', 'warning');
      }

      // Reset form
      setSelectedTask('');
      setLogContent('');
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      showToast(`Failed to upload log: ${error.message}`, 'error');
    } finally {
      setUploading(false);
    }
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
            {tasks.map((task) => (
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
                onClick={() => {
                  setSelectedFile(null);
                  const fileInput = document.getElementById('file-upload');
                  if (fileInput) fileInput.value = '';
                }}
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Upload Log
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}