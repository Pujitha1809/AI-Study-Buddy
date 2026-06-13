import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import StudyMode from './components/StudyMode';
import CheatSheet from './components/CheatSheet';
import { BookOpen, MessageSquare, FileText } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [files, setFiles] = useState([]);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar for File Uploads */}
      <Sidebar files={files} setFiles={setFiles} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        {/* Top Navigation */}
        <header className="h-16 border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
          <h1 className="text-xl font-semibold text-slate-800">
            {activeTab === 'chat' ? 'Document Chat' : activeTab === 'study' ? 'Study Mode (Flashcards)' : 'Cheat Sheet'}
          </h1>
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('study')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'study'
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Study Mode
            </button>
            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'cheatsheet'
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Cheat Sheet
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' ? (
            <ChatInterface hasFiles={files.length > 0} />
          ) : activeTab === 'study' ? (
            <StudyMode hasFiles={files.length > 0} />
          ) : (
            <CheatSheet files={files} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
