import React, { useState, useEffect } from 'react';
import { generateChineseLesson } from '../services/geminiService';
import { FlashcardData, LoadingState } from '../types';
import { RefreshCw, Volume2 } from 'lucide-react';

const Chinese: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [status, setStatus] = useState<LoadingState>('idle');

  const loadLesson = async () => {
    setStatus('loading');
    const data = await generateChineseLesson();
    if (data.length > 0) {
      setCards(data);
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  useEffect(() => {
    loadLesson();
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pb-28 px-4 pt-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-red">中文 Learning</h1>
        <button 
          onClick={loadLesson}
          disabled={status === 'loading'}
          className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`${status === 'loading' ? 'animate-spin' : ''} text-brand-red`} />
        </button>
      </div>

      {status === 'loading' && (
        <div className="text-center py-20">
          <div className="animate-bounce text-6xl mb-4">🐼</div>
          <p className="text-xl font-bold text-gray-500">Loading new words...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-20">
          <p className="text-xl text-brand-red">Oops! Could not load lesson.</p>
          <button onClick={loadLesson} className="mt-4 px-6 py-2 bg-brand-red text-white rounded-xl">Try Again</button>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-lg p-6 border-b-4 border-brand-red transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-brand-red/10 px-4 py-1 rounded-full">
                  <span className="text-brand-red font-bold text-sm">Word {idx + 1}</span>
                </div>
                <button 
                  onClick={() => speak(card.word)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-brand-red hover:text-white transition-colors"
                >
                  <Volume2 size={24} />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-8xl mb-2">{card.emoji}</div>
                <h2 className="text-6xl font-extrabold text-gray-800 mb-2">{card.word}</h2>
                <p className="text-2xl text-brand-red font-medium">{card.pronunciation}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-lg font-bold text-gray-700 mb-1">{card.translation}</p>
                <p className="text-gray-500 italic">"{card.exampleSentence}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chinese;
