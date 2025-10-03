import { v4 as uuidv4 } from 'uuid';
import type { GameRecord, GameStatistics, DifficultyStats } from '../types/statistics';
import type { Difficulty } from '../types/game';
import { Difficulty as DifficultyEnum } from '../types/game';

const STORAGE_KEY = 'card-memory-game-records';
const MAX_RECORDS = 100; // 최대 저장 기록 수

/**
 * 모든 게임 기록 가져오기
 */
export function getAllRecords(): GameRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as GameRecord[];
  } catch (error) {
    console.error('Failed to load game records:', error);
    return [];
  }
}

/**
 * 게임 기록 저장
 */
export function saveGameRecord(record: Omit<GameRecord, 'id' | 'completedAt'>): GameRecord {
  const newRecord: GameRecord = {
    ...record,
    id: uuidv4(),
    completedAt: new Date().toISOString(),
  };

  try {
    const records = getAllRecords();
    records.unshift(newRecord); // 최신 기록을 앞에 추가

    // 최대 기록 수 제한
    const limitedRecords = records.slice(0, MAX_RECORDS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedRecords));
    return newRecord;
  } catch (error) {
    console.error('Failed to save game record:', error);
    return newRecord;
  }
}

/**
 * 난이도별 통계 계산
 */
export function calculateDifficultyStats(difficulty: Difficulty): DifficultyStats {
  const records = getAllRecords().filter((r) => r.difficulty === difficulty);
  const completedRecords = records.filter((r) => r.isCompleted);

  if (records.length === 0) {
    return {
      difficulty,
      gamesPlayed: 0,
      gamesCompleted: 0,
      bestScore: 0,
      averageScore: 0,
      bestTime: 0,
      averageMoves: 0,
    };
  }

  const scores = completedRecords.map((r) => r.score);
  const times = completedRecords.map((r) => r.timeElapsed);
  const moves = completedRecords.map((r) => r.moves);

  return {
    difficulty,
    gamesPlayed: records.length,
    gamesCompleted: completedRecords.length,
    bestScore: scores.length > 0 ? Math.max(...scores) : 0,
    averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    bestTime: times.length > 0 ? Math.min(...times) : 0,
    averageMoves: moves.length > 0 ? Math.round(moves.reduce((a, b) => a + b, 0) / moves.length) : 0,
  };
}

/**
 * 전체 통계 계산
 */
export function calculateGameStatistics(): GameStatistics {
  const records = getAllRecords();
  const completedRecords = records.filter((r) => r.isCompleted);

  const difficultyStats: DifficultyStats[] = [
    DifficultyEnum.EASY,
    DifficultyEnum.MEDIUM,
    DifficultyEnum.HARD,
    DifficultyEnum.EXPERT,
  ].map(calculateDifficultyStats);

  return {
    totalGamesPlayed: records.length,
    totalGamesCompleted: completedRecords.length,
    totalPlayTime: records.reduce((total, r) => total + r.timeElapsed, 0),
    difficultyStats,
    recentRecords: records.slice(0, 10), // 최근 10개 기록
  };
}

/**
 * 난이도별 최고 기록 가져오기
 */
export function getBestRecordByDifficulty(difficulty: Difficulty): GameRecord | null {
  const records = getAllRecords()
    .filter((r) => r.difficulty === difficulty && r.isCompleted)
    .sort((a, b) => b.score - a.score);

  return records.length > 0 ? records[0] : null;
}

/**
 * 모든 기록 삭제 (테스트/개발용)
 */
export function clearAllRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear records:', error);
  }
}
