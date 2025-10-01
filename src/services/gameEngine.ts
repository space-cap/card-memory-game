import { v4 as uuidv4 } from 'uuid';
import type { GameConfig } from '../types/game';
import type { GameState } from '../types/game';
import type { Card } from '../types/game';
import type { Player } from '../types/game';
import { GameStatus, CardState, GameMode, DIFFICULTY_CONFIG } from '../types/game';
import { createShuffledPairs } from './shuffleAlgorithm';

/**
 * 게임 초기화
 * @param config - 게임 설정
 * @param deckImages - 덱 이미지 URL 배열
 * @returns 초기 게임 상태
 */
export function initializeGame(config: GameConfig, deckImages: string[]): GameState {
  const difficultyConfig = DIFFICULTY_CONFIG[config.difficulty];

  // 카드 쌍 생성 및 셔플
  const shuffledPairs = createShuffledPairs(deckImages, difficultyConfig.pairs);

  // 카드 객체 생성
  const cards: Card[] = shuffledPairs.map((pair) => ({
    id: uuidv4(),
    deckId: config.deckId,
    imageUrl: pair.imageUrl,
    state: CardState.HIDDEN,
    pairId: pair.pairId,
  }));

  // 플레이어 생성
  const players: Player[] =
    config.mode === GameMode.SINGLE
      ? [{ id: 'player-1', name: 'Player', score: 0, matches: 0 }]
      : [
          { id: 'player-1', name: 'Player 1', score: 0, matches: 0 },
          { id: 'player-2', name: 'Player 2', score: 0, matches: 0 },
        ];

  return {
    config,
    status: GameStatus.IDLE,
    cards,
    players,
    currentPlayerId: players[0].id,
    revealedCards: [],
    stats: {
      moves: 0,
      matches: 0,
      timeElapsed: 0,
      startTime: 0,
    },
  };
}

/**
 * 카드 뒤집기 가능 여부 확인
 */
export function canFlipCard(state: GameState, cardId: string): boolean {
  if (state.status !== GameStatus.PLAYING) return false;
  if (state.revealedCards.length >= 2) return false;

  const card = state.cards.find((c) => c.id === cardId);
  if (!card) return false;
  if (card.state !== CardState.HIDDEN) return false;

  return true;
}

/**
 * 두 카드가 매칭되는지 확인
 */
export function checkMatch(card1: Card, card2: Card): boolean {
  return card1.pairId === card2.pairId;
}

/**
 * 게임 종료 조건 확인
 */
export function isGameOver(state: GameState): boolean {
  return state.cards.every((card) => card.state === CardState.MATCHED);
}

/**
 * 시간 제한 초과 확인
 */
export function isTimeUp(state: GameState): boolean {
  const timeLimit = DIFFICULTY_CONFIG[state.config.difficulty].timeLimit;
  if (!timeLimit) return false;

  return state.stats.timeElapsed >= timeLimit;
}

/**
 * 다음 플레이어로 전환 (대전 모드)
 */
export function getNextPlayer(state: GameState): string {
  if (state.config.mode !== GameMode.VERSUS) {
    return state.currentPlayerId!;
  }

  const currentIndex = state.players.findIndex((p) => p.id === state.currentPlayerId);
  const nextIndex = (currentIndex + 1) % state.players.length;
  return state.players[nextIndex].id;
}

/**
 * 승자 결정 (대전 모드)
 */
export function determineWinner(state: GameState): Player | null {
  if (state.config.mode !== GameMode.VERSUS) return null;

  const [player1, player2] = state.players;
  if (player1.matches > player2.matches) return player1;
  if (player2.matches > player1.matches) return player2;

  return null; // 무승부
}
