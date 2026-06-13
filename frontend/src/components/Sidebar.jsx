import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, BookOpen } from 'lucide-react';
import axios from 'axios';

import { API_BASE_URL } from '../config';

export default function Sidebar({ files, setFiles }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setFiles((prev) => [...prev, { name: file.name, chunks: response.data.chunksCount }]);
      event.target.value = null; // Reset input
    } catch (error) {
      console.error('Upload Error:', error);
      const serverError = error.response?.data?.error || 'Failed to upload and process PDF.';
      alert(`Error: ${serverError}\n(Check backend logs for details)`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold flex items-center text-white">
          <BookOpen className="w-6 h-6 mr-2 text-indigo-400" />
          Study Buddy
        </h2>
        <p className="text-sm text-slate-400 mt-1">AI-Powered RAG System</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Upload Materials
        </h3>
        
        {/* Upload Zone */}
        <label className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          isUploading ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-800'
        }`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
            ) : (
              <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
            )}
            <p className="text-sm text-slate-300">
              {isUploading ? 'Processing...' : 'Click to upload PDF'}
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="application/pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Uploaded Documents
          </h3>
          {files.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4 bg-slate-800/50 rounded-lg">
              No documents yet
            </p>
          ) : (
            <ul className="space-y-3">
              {files.map((file, idx) => (
                <li key={idx} className="flex items-start p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <FileText className="w-5 h-5 text-indigo-400 mr-3 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" />
                      {file.chunks} chunks embedded
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
