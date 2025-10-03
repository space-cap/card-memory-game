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
  TIME_ATTACK = 'time_attack',
  CHALLENGE = 'challenge',
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
 * 콤보 상태 (타임 어택 모드)
 */
export interface ComboState {
  count: number; // 현재 콤보 카운트
  multiplier: number; // 점수 배율 (1x, 2x, 3x...)
  lastMatchTime: number; // 마지막 매칭 시간
  maxCombo: number; // 최대 콤보 기록
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
  combo?: ComboState; // 타임 어택 모드 콤보
  timeBonus?: number; // 타임 어택 모드 시간 보너스
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

/**
 * 타임 어택 모드별 설정
 */
export const TIME_ATTACK_CONFIG = {
  [Difficulty.EASY]: {
    pairs: 6,
    timeLimit: 60, // 1분
    comboWindow: 5, // 5초 이내 매칭 시 콤보 유지
    gridCols: 4,
  },
  [Difficulty.MEDIUM]: {
    pairs: 9,
    timeLimit: 90, // 1.5분
    comboWindow: 4,
    gridCols: 6,
  },
  [Difficulty.HARD]: {
    pairs: 12,
    timeLimit: 120, // 2분
    comboWindow: 3,
    gridCols: 6,
  },
  [Difficulty.EXPERT]: {
    pairs: 18,
    timeLimit: 180, // 3분
    comboWindow: 3,
    gridCols: 6,
  },
} as const;

/**
 * 게임 액션 타입
 */
export enum GameActionType {
  INIT_GAME = 'INIT_GAME',
  START_GAME = 'START_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  FLIP_CARD = 'FLIP_CARD',
  MATCH_CARDS = 'MATCH_CARDS',
  UNMATCH_CARDS = 'UNMATCH_CARDS',
  UPDATE_TIME = 'UPDATE_TIME',
  END_GAME = 'END_GAME',
  RESET_GAME = 'RESET_GAME',
  SWITCH_PLAYER = 'SWITCH_PLAYER',
  UPDATE_COMBO = 'UPDATE_COMBO',
  RESET_COMBO = 'RESET_COMBO',
}

/**
 * 게임 액션 인터페이스
 */
export type GameAction =
  | { type: GameActionType.INIT_GAME; payload: { config: GameConfig; cards: Card[] } }
  | { type: GameActionType.START_GAME }
  | { type: GameActionType.PAUSE_GAME }
  | { type: GameActionType.RESUME_GAME }
  | { type: GameActionType.FLIP_CARD; payload: { cardId: string } }
  | { type: GameActionType.MATCH_CARDS; payload: { cardIds: [string, string] } }
  | { type: GameActionType.UNMATCH_CARDS }
  | { type: GameActionType.UPDATE_TIME; payload: { timeElapsed: number } }
  | { type: GameActionType.END_GAME; payload: { finalScore: number } }
  | { type: GameActionType.RESET_GAME }
  | { type: GameActionType.SWITCH_PLAYER }
  | { type: GameActionType.UPDATE_COMBO; payload: { combo: ComboState } }
  | { type: GameActionType.RESET_COMBO };
