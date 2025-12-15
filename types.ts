export enum Subject {
  Chinese = 'CHINESE',
  English = 'ENGLISH',
  Math = 'MATH',
  Drawing = 'DRAWING'
}

export interface FlashcardData {
  word: string;
  pronunciation: string; // Pinyin or IPA
  translation: string;
  exampleSentence: string;
  emoji: string;
}

export interface MathProblem {
  id: number;
  question: string;
  options: number[];
  correctAnswer: number;
}

export interface DrawingFeedback {
  feedback: string;
  suggestion: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
