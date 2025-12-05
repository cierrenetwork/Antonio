export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PREVIEW = 'PREVIEW',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR'
}

export interface QuizSettings {
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  topic: string;
}