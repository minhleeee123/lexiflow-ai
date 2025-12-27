export interface WordData {
  id: string;
  word: string;
  ipa: string;
  pos: string; // Part of Speech
  definition: string;
  example: string;
}

export interface Deck {
  id: string;
  name: string;
  isSystem: boolean;
  words: WordData[];
}

export interface QuizQuestion {
  id: string;
  targetWordId: string;
  prompt: {
    word: string;
    ipa: string;
    example: string;
  };
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface ReadingComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface ReadingSessionData {
  title: string;
  content: string; // The text content with marked words like {{word}}
  questions: ReadingComprehensionQuestion[];
}

export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  READING = 'READING',
  DECK_BUILDER = 'DECK_BUILDER',
}
