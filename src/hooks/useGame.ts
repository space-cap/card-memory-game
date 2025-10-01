import { useCallback } from 'react';
import { useGameContext } from '../store';
import type { GameConfig } from '../types/game';
import { GameActionType, CardState } from '../types/game';
import { initializeGame, canFlipCard, checkMatch, isGameOver, isTimeUp } from '../services/gameEngine';
import { calculateScore } from '../services/scoreCalculator';

/**
 * 게임 로직을 관리하는 커스텀 훅
 */
export function useGame() {
  const { state, dispatch } = useGameContext();

  /**
   * 게임 초기화
   */
  const initGame = useCallback(
    (config: GameConfig, deckImages: string[]) => {
      const gameState = initializeGame(config, deckImages);
      dispatch({
        type: GameActionType.INIT_GAME,
        payload: { config, cards: gameState.cards },
      });
    },
    [dispatch]
  );

  /**
   * 게임 시작
   */
  const startGame = useCallback(() => {
    dispatch({ type: GameActionType.START_GAME });
  }, [dispatch]);

  /**
   * 게임 일시정지
   */
  const pauseGame = useCallback(() => {
    dispatch({ type: GameActionType.PAUSE_GAME });
  }, [dispatch]);

  /**
   * 게임 재개
   */
  const resumeGame = useCallback(() => {
    dispatch({ type: GameActionType.RESUME_GAME });
  }, [dispatch]);

  /**
   * 카드 뒤집기
   */
  const flipCard = useCallback(
    (cardId: string) => {
      if (!canFlipCard(state, cardId)) return;

      dispatch({
        type: GameActionType.FLIP_CARD,
        payload: { cardId },
      });

      // 2장째 뒤집었을 때 매칭 체크
      const newRevealedCards = [...state.revealedCards, cardId];
      if (newRevealedCards.length === 2) {
        const [card1Id, card2Id] = newRevealedCards;
        const card1 = state.cards.find((c) => c.id === card1Id);
        const card2 = state.cards.find((c) => c.id === card2Id);

        if (card1 && card2) {
          setTimeout(() => {
            if (checkMatch(card1, card2)) {
              // 매칭 성공
              dispatch({
                type: GameActionType.MATCH_CARDS,
                payload: { cardIds: [card1Id, card2Id] },
              });

              // 게임 종료 체크
              const updatedCards = state.cards.map((c) =>
                [card1Id, card2Id].includes(c.id) ? { ...c, state: CardState.MATCHED } : c
              );
              const allMatched = updatedCards.every((c) => c.state === CardState.MATCHED);

              if (allMatched) {
                const finalScore = calculateScore(
                  state.stats.matches + 1,
                  state.stats.moves + 1,
                  state.stats.timeElapsed,
                  state.config.difficulty
                );

                dispatch({
                  type: GameActionType.END_GAME,
                  payload: { finalScore },
                });
              }
            } else {
              // 매칭 실패
              dispatch({ type: GameActionType.UNMATCH_CARDS });

              // 대전 모드면 플레이어 전환
              if (state.config.mode === 'versus') {
                dispatch({ type: GameActionType.SWITCH_PLAYER });
              }
            }
          }, 1000); // 1초 후 처리
        }
      }
    },
    [state, dispatch]
  );

  /**
   * 게임 리셋
   */
  const resetGame = useCallback(() => {
    dispatch({ type: GameActionType.RESET_GAME });
  }, [dispatch]);

  /**
   * 시간 업데이트
   */
  const updateTime = useCallback(
    (timeElapsed: number) => {
      dispatch({
        type: GameActionType.UPDATE_TIME,
        payload: { timeElapsed },
      });

      // 시간 제한 체크
      if (isTimeUp({ ...state, stats: { ...state.stats, timeElapsed } })) {
        const finalScore = calculateScore(
          state.stats.matches,
          state.stats.moves,
          timeElapsed,
          state.config.difficulty
        );

        dispatch({
          type: GameActionType.END_GAME,
          payload: { finalScore },
        });
      }
    },
    [state, dispatch]
  );

  return {
    state,
    initGame,
    startGame,
    pauseGame,
    resumeGame,
    flipCard,
    resetGame,
    updateTime,
    isGameOver: isGameOver(state),
  };
}
