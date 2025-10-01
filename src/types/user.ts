/**
 * 사용자 인터페이스
 */
export interface User {
  id: string;
  name: string;
  points: number;
  ownedDeckIds: string[];
  createdAt: string;
}

/**
 * 포인트 거래 유형
 */
export enum PointTransactionType {
  EARN = 'earn', // 획득
  SPEND = 'spend', // 사용
  PURCHASE = 'purchase', // 구매
}

/**
 * 포인트 거래 내역
 */
export interface PointTransaction {
  id: string;
  userId: string;
  type: PointTransactionType;
  amount: number;
  reason: string; // '게임 완료', '덱 구매', '포인트 구매' 등
  timestamp: string;
}

/**
 * 게임 기록
 */
export interface GameRecord {
  id: string;
  userId: string;
  mode: string;
  difficulty: string;
  deckId: string;
  score: number;
  moves: number;
  timeElapsed: number;
  completed: boolean;
  pointsEarned: number;
  timestamp: string;
}

/**
 * 사용자 통계
 */
export interface UserStats {
  totalGames: number;
  completedGames: number;
  totalPoints: number;
  totalTimeSpent: number; // 초
  averageScore: number;
  bestScore: number;
  favoriteMode: string;
  favoriteDifficulty: string;
}
