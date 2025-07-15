import React from 'react';

export default function FileUploadArea({ files, setFiles, handleFileChange, handleDrop, handleDragOver }) {
  return (
    <div className="flex flex-col min-w-0 max-w-[500px] justify-start">
      <label className="font-medium mb-1">Upload files:</label>
      <div
        className={`border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors ${files.length ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-50'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('fileInput').click()}
        style={{ minHeight: 120 }}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {files.length ? (
          <div>
            <p className="font-medium mb-2">{files.length} file(s) selected</p>
            <ul
              className="text-sm text-gray-700 mb-2"
              style={files.length > 3 ? { maxHeight: '66px', overflowY: 'auto', border: '1px solid #ffe082', borderRadius: '6px', background: '#fffde7', padding: '4px' } : {}}
            >
              {files.map((file, idx) => (
                <li key={idx} className="flex items-center group pr-2">
                  <span className="truncate flex-grow mr-1 flex items-center min-w-0 group-hover:bg-yellow-100 group-hover:text-yellow-800 transition-colors duration-150 rounded" style={{maxWidth: '100%'}}>{file.name}</span>
                  <button
                    type="button"
                    className="flex items-center text-gray-400 hover:text-red-500 text-base font-bold focus:outline-none border border-gray-300 rounded-full bg-white transition-all duration-150 hover:scale-110"
                    style={{marginLeft: '4px', height: '20px', width: '24px', justifyContent: 'center'}} 
                    title="Remove file"
                    onMouseEnter={e => e.currentTarget.parentElement.classList.add('hovering-x')}
                    onMouseLeave={e => e.currentTarget.parentElement.classList.remove('hovering-x')}
                    onClick={e => {
                      e.stopPropagation();
                      setFiles(prev => prev.filter((_, i) => i !== idx));
                    }}
                  >
                    <span style={{lineHeight: 1}}>×</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="text-xs text-red-500 underline"
              onClick={e => {
                e.stopPropagation();
                setFiles([]);
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.value = '';
              }}
            >Clear</button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg width="40" height="40" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 48 48" className="mx-auto mb-2">
              <path d="M24 34V14M24 14l-7 7m7-7l7 7" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="36" width="32" height="4" rx="2" fill="#e5e7eb"/>
            </svg>
            <span className="text-gray-500 text-sm">
              <span className="text-yellow-600 font-medium cursor-pointer underline" style={{cursor:'pointer'}}>Upload a file</span> or drag and drop
            </span>
            <span className="text-xs text-gray-400 mt-1">TXT, MD, PDF, DOC up to 10MB</span>
          </div>
        )}
      </div>
    </div>
  );
}
