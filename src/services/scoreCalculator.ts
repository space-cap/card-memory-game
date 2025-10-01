import { Difficulty } from '../types';

/**
 * 점수 계산 설정
 */
const SCORE_CONFIG = {
  matchBonus: 100, // 매칭 성공 시 기본 점수
  timeBonus: 10, // 남은 시간 1초당 보너스
  movesPenalty: 5, // 이동 1회당 감점
  difficultyMultiplier: {
    [Difficulty.EASY]: 1,
    [Difficulty.MEDIUM]: 1.5,
    [Difficulty.HARD]: 2,
    [Difficulty.EXPERT]: 3,
  },
  perfectMatchBonus: 500, // 완벽한 플레이 (최소 이동) 보너스
};

/**
 * 게임 점수 계산
 * @param matches - 매칭 성공 횟수
 * @param moves - 총 이동 횟수
 * @param timeElapsed - 소요 시간 (초)
 * @param difficulty - 난이도
 * @param timeLimit - 제한 시간 (초, undefined면 무제한)
 * @returns 최종 점수
 */
export function calculateScore(
  matches: number,
  moves: number,
  timeElapsed: number,
  difficulty: Difficulty,
  timeLimit?: number
): number {
  // 기본 점수 (매칭 성공)
  let score = matches * SCORE_CONFIG.matchBonus;

  // 시간 보너스 (제한 시간이 있는 경우)
  if (timeLimit) {
    const remainingTime = Math.max(0, timeLimit - timeElapsed);
    score += remainingTime * SCORE_CONFIG.timeBonus;
  }

  // 이동 횟수 감점
  score -= moves * SCORE_CONFIG.movesPenalty;

  // 난이도 배수 적용
  score *= SCORE_CONFIG.difficultyMultiplier[difficulty];

  // 완벽한 플레이 보너스 (최소 이동 횟수로 클리어)
  const minMoves = matches; // 최소 이동 = 매칭 횟수
  if (moves === minMoves) {
    score += SCORE_CONFIG.perfectMatchBonus;
  }

  // 점수는 0 이하로 떨어지지 않음
  return Math.max(0, Math.round(score));
}

/**
 * 획득 포인트 계산 (게임 완료 시)
 * @param score - 게임 점수
 * @param difficulty - 난이도
 * @returns 획득 포인트
 */
export function calculateEarnedPoints(score: number, difficulty: Difficulty): number {
  // 점수의 10%를 포인트로 변환
  const basePoints = Math.floor(score * 0.1);

  // 난이도 보너스
  const difficultyBonus = {
    [Difficulty.EASY]: 10,
    [Difficulty.MEDIUM]: 25,
    [Difficulty.HARD]: 50,
    [Difficulty.EXPERT]: 100,
  };

  return basePoints + difficultyBonus[difficulty];
}
