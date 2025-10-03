import type { Difficulty, GameMode } from './game';

/**
 * 게임 기록
 */
export interface GameRecord {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  deckId: string;
  score: number;
  moves: number;
  timeElapsed: number;
  completedAt: string; // ISO 8601 format
  isCompleted: boolean; // 시간 초과로 실패한 경우 false
}

/**
 * 난이도별 통계
 */
export interface DifficultyStats {
  difficulty: Difficulty;
  gamesPlayed: number;
  gamesCompleted: number;
  bestScore: number;
  averageScore: number;
  bestTime: number;
  averageMoves: number;
}

/**
 * 전체 통계
 */
export interface GameStatistics {
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  totalPlayTime: number; // seconds
  difficultyStats: DifficultyStats[];
  recentRecords: GameRecord[];
}
