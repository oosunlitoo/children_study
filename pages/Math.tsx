import React, { useState, useEffect } from 'react';
import { generateMathQuiz } from '../services/geminiService';
import { MathProblem, LoadingState } from '../types';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const MathPage: React.FC = () => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const loadQuiz = async () => {
    setStatus('loading');
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
    setSelectedAnswer(null);
    const data = await generateMathQuiz();
    if (data.length > 0) {
      setProblems(data);
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    
    if (answer === problems[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
      // Visual feedback could go here
    }

    // Auto advance after delay
    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-28 px-4 pt-8 max-w-2xl mx-auto bg-brand-cream">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-green">Math Fun!</h1>
        <button 
          onClick={loadQuiz}
          disabled={status === 'loading'}
          className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`${status === 'loading' ? 'animate-spin' : ''} text-brand-green`} />
        </button>
      </div>

      {status === 'loading' && (
        <div className="text-center py-20">
          <div className="animate-bounce text-6xl mb-4">🧮</div>
          <p className="text-xl font-bold text-gray-500">Making problems...</p>
        </div>
      )}

      {status === 'success' && !showResult && problems.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border-b-8 border-brand-green relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
            <div 
              className="h-full bg-brand-green transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
            />
          </div>
          
          <div className="text-center mt-6 mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {problems[currentIndex].question}
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {problems[currentIndex].options.map((opt, idx) => {
                let btnClass = "p-6 rounded-2xl text-2xl font-bold transition-all duration-200 border-2 shadow-sm ";
                
                if (selectedAnswer === null) {
                  btnClass += "bg-white border-gray-200 hover:border-brand-green hover:bg-green-50 text-gray-700";
                } else if (opt === problems[currentIndex].correctAnswer) {
                  btnClass += "bg-green-500 border-green-600 text-white transform scale-105";
                } else if (opt === selectedAnswer) {
                  btnClass += "bg-red-400 border-red-500 text-white";
                } else {
                   btnClass += "bg-gray-50 border-gray-100 text-gray-300";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={selectedAnswer !== null}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm font-bold uppercase tracking-wider">
            Question {currentIndex + 1} of {problems.length}
          </div>
        </div>
      )}

      {showResult && (
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center border-b-8 border-brand-green animate-in fade-in zoom-in duration-300">
            <div className="text-6xl mb-4">
                {score === problems.length ? '🏆' : score > 0 ? '🌟' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mb-8">You got {score} out of {problems.length} right.</p>
            
            <button 
                onClick={loadQuiz}
                className="bg-brand-green text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-green-500 transition-colors w-full"
            >
                Play Again
            </button>
        </div>
      )}
    </div>
  );
};

export default MathPage;
