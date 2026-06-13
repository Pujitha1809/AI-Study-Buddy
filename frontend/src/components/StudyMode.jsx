import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function StudyMode({ hasFiles }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const generateQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz`);
      setFlashcards(response.data.quiz);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSelectedOption(null);
    } catch (error) {
      console.error('Quiz Error:', error);
      alert('Failed to generate quiz. Make sure enough PDFs are uploaded.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setSelectedOption(null);
    }
  };

  const handleOptionClick = (option) => {
    if (isFlipped) return; // Prevent changing answer after reveal
    setSelectedOption(option);
    setIsFlipped(true);
  };

  if (!hasFiles) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-center px-6">
        <BrainCircuit className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Study Mode is Locked</h2>
        <p className="text-slate-500 max-w-md">Upload at least one PDF document to unlock AI-generated multiple-choice flashcards.</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Generate Flashcards</h2>
          <p className="text-slate-500 mb-8">I'll read through your uploaded notes and create a quick 3-question quiz to test your knowledge.</p>
          <button
            onClick={generateQuiz}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-70 transition-colors shadow-sm shadow-indigo-200"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
            ) : (
              'Start Quiz Session'
            )}
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isCorrect = selectedOption === currentCard.correctAnswer;

  return (
    <div className="h-full flex flex-col bg-slate-50 py-12 px-6 overflow-y-auto">
      {/* Progress */}
      <div className="max-w-2xl w-full mx-auto mb-8 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Question {currentIndex + 1} of {flashcards.length}
        </span>
        <button
          onClick={generateQuiz}
          disabled={isLoading}
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
        >
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          New Quiz
        </button>
      </div>

      {/* Flashcard Area */}
      <div className="max-w-2xl w-full mx-auto relative flex-1" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? 'flipped' : 'front')}
            initial={{ opacity: 0, rotateX: isFlipped ? -90 : 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: isFlipped ? 90 : -90 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 min-h-[400px] flex flex-col"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {!isFlipped ? (
              // FRONT OF CARD
              <>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                  {currentCard.question}
                </h3>
                <div className="space-y-3 mt-auto">
                  {currentCard.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-slate-700 font-medium group"
                    >
                      <span className="inline-block w-8 text-slate-400 group-hover:text-indigo-500 transition-colors">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              // BACK OF CARD (REVEAL)
              <>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-6 w-max ${
                  isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {isCorrect ? '✨ Correct!' : '❌ Incorrect'}
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
                  {currentCard.question}
                </h3>
                
                <div className="bg-slate-50 p-6 rounded-2xl mb-auto">
                  <p className="text-sm text-slate-500 mb-2 font-medium uppercase tracking-wider">Correct Answer</p>
                  <p className="text-lg font-semibold text-slate-900 mb-6">{currentCard.correctAnswer}</p>
                  
                  <p className="text-sm text-slate-500 mb-2 font-medium uppercase tracking-wider">Explanation</p>
                  <p className="text-slate-700 leading-relaxed">{currentCard.explanation}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  {currentIndex < flashcards.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
                    >
                      Next Question
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={generateQuiz}
                      className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-colors"
                    >
                      Generate Another Quiz
                      <RefreshCw className="w-5 h-5 ml-2" />
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
