/**
 * 게임 난이도
 */
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

/**
 * 게임 모드
 */
export enum GameMode {
  SINGLE = 'single',
  VERSUS = 'versus',
}

/**
 * 카드 상태
 */
export enum CardState {
  HIDDEN = 'hidden',
  REVEALED = 'revealed',
  MATCHED = 'matched',
}

/**
 * 게임 상태
 */
export enum GameStatus {
  IDLE = 'idle',
  PLAYING = 'playing',
  PAUSED = 'paused',
  FINISHED = 'finished',
}

/**
 * 카드 인터페이스
 */
export interface Card {
  id: string;
  deckId: string;
  imageUrl: string;
  state: CardState;
  pairId: string; // 같은 pairId를 가진 카드가 매칭됨
}

/**
 * 플레이어 인터페이스
 */
export interface Player {
  id: string;
  name: string;
  score: number;
  matches: number;
}

/**
 * 게임 설정
 */
export interface GameConfig {
  mode: GameMode;
  difficulty: Difficulty;
  deckId: string;
  timeLimit?: number; // 시간 제한 (초), undefined면 무제한
}

/**
 * 게임 통계
 */
export interface GameStats {
  moves: number;
  matches: number;
  timeElapsed: number; // 초
  startTime: number;
  endTime?: number;
}

/**
 * 게임 상태 인터페이스
 */
export interface GameState {
  config: GameConfig;
  status: GameStatus;
  cards: Card[];
  players: Player[];
  currentPlayerId?: string; // 대전 모드에서 현재 턴의 플레이어
  revealedCards: string[]; // 현재 뒤집힌 카드 ID들 (최대 2개)
  stats: GameStats;
}

/**
 * 난이도별 게임 설정
 */
export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    pairs: 6, // 6쌍 = 12장
    timeLimit: undefined,
    gridCols: 4,
  },
  [Difficulty.MEDIUM]: {
    pairs: 9, // 9쌍 = 18장
    timeLimit: undefined,
    gridCols: 6,
  },
  [Difficulty.HARD]: {
    pairs: 12, // 12쌍 = 24장
    timeLimit: 180, // 3분
    gridCols: 6,
  },
  [Difficulty.EXPERT]: {
    pairs: 18, // 18쌍 = 36장
    timeLimit: 300, // 5분
    gridCols: 6,
  },
} as const;
