export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type GameMode = 'timed' | 'questions' | 'endless' | 'custom';
export type CustomGoal = 'time' | 'questions' | 'endless';
export interface CustomGameConfig { goal: CustomGoal; seconds: number; questionCount: number; }
export type QuestionSource = 'template' | 'fixed' | 'ai';

export interface Question {
  id: string;
  text: string;
  kana: string;
  difficulty: Difficulty;
  category: string;
  source: QuestionSource;
  duplicateKey: string;
  templateId: string;
}

export interface GameResult {
  id: string;
  playedAt: string;
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  correctKeys: number;
  mistakes: number;
  accuracy: number;
  kpm: number;
  elapsedSeconds: number;
  completedQuestions: number;
  maxCombo: number;
  isPersonalBest: boolean;
}

export interface AppSettings {
  sound: boolean;
  missSound: 'soft' | 'wood' | 'digital' | 'bell' | 'low';
  showRomaji: boolean;
  showKana: boolean;
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
}

export const DEFAULT_SETTINGS: AppSettings = {
  sound: true, missSound: 'soft', showRomaji: true, showKana: true, theme: 'dark', fontSize: 'medium'
};

