import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { FileText, Loader2, RefreshCw, Download } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function CheatSheet({ files }) {
  const [cheatSheet, setCheatSheet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateCheatSheet = async () => {
    if (!files || files.length === 0) {
      setError("No documents available. Please upload a file first.");
      return;
    }

    // Use the first uploaded file's name as documentId for now
    const documentId = files[0].name;
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/cheat-sheet/${encodeURIComponent(documentId)}`);
      setCheatSheet(response.data.cheatSheet);
    } catch (err) {
      console.error('Cheat Sheet Error:', err);
      setError(err.response?.data?.error || "Failed to generate cheat sheet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate if we haven't generated yet
  useEffect(() => {
    if (files.length > 0 && !cheatSheet && !isLoading && !error) {
      generateCheatSheet();
    }
  }, [files]);

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-white p-8">
        <FileText className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">No Document Uploaded</h2>
        <p className="text-center max-w-md">Upload a lecture PDF from the sidebar to generate a beautifully structured Markdown Cheat Sheet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header controls */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-semibold flex items-center text-slate-800">
          <FileText className="w-5 h-5 mr-2 text-indigo-500" />
          {files[0].name} Cheat Sheet
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              window.open(`${API_BASE_URL}/cheat-sheet/${encodeURIComponent(files[0].name)}/download`, '_blank');
            }}
            disabled={!cheatSheet || isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={generateCheatSheet}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-500" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {cheatSheet ? 'Regenerate' : 'Generate Now'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-600 font-medium animate-pulse">Analyzing document and structuring cheat sheet...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        ) : cheatSheet ? (
          <div className="prose prose-slate prose-indigo max-w-3xl mx-auto">
            <ReactMarkdown>{cheatSheet}</ReactMarkdown>
          </div>
        ) : null}
      </div>
    </div>
  );
}
