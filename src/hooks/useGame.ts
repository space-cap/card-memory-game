import { useCallback } from 'react';
import { useGameContext } from '../store';
import type { GameConfig, ComboState } from '../types/game';
import { GameActionType, CardState, TIME_ATTACK_CONFIG } from '../types/game';
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
        payload: gameState,
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
    (cardId: string, onMatchResult?: (isMatch: boolean) => void) => {
      // 현재 상태에서 뒤집기 가능한지 체크
      if (!canFlipCard(state, cardId)) {
        console.log('Cannot flip card:', cardId, 'state:', state.status, 'revealed:', state.revealedCards.length);
        return;
      }

      console.log('Flipping card:', cardId, 'currently revealed:', state.revealedCards);

      // 첫 번째 카드인 경우
      if (state.revealedCards.length === 0) {
        dispatch({
          type: GameActionType.FLIP_CARD,
          payload: { cardId },
        });
        return;
      }

      // 두 번째 카드인 경우
      if (state.revealedCards.length === 1) {
        dispatch({
          type: GameActionType.FLIP_CARD,
          payload: { cardId },
        });

        const card1Id = state.revealedCards[0];
        const card2Id = cardId;
        const card1 = state.cards.find((c) => c.id === card1Id);
        const card2 = state.cards.find((c) => c.id === card2Id);

        if (card1 && card2) {
          setTimeout(() => {
            const isMatch = checkMatch(card1, card2);

            // 매칭 결과 콜백 실행
            onMatchResult?.(isMatch);

            if (isMatch) {
              console.log('Match successful!');

              // 타임 어택 모드: 콤보 업데이트
              if (state.config.mode === 'time_attack' && state.stats.combo) {
                const currentTime = Date.now();
                const timeSinceLastMatch = state.stats.combo.lastMatchTime
                  ? (currentTime - state.stats.combo.lastMatchTime) / 1000
                  : 999;

                const comboWindow = TIME_ATTACK_CONFIG[state.config.difficulty].comboWindow;

                // 콤보 윈도우 안에 매칭하면 콤보 증가
                if (timeSinceLastMatch <= comboWindow) {
                  const newComboCount = state.stats.combo.count + 1;
                  const newMultiplier = Math.min(Math.floor(newComboCount / 3) + 1, 5); // 최대 5배
                  const newCombo: ComboState = {
                    count: newComboCount,
                    multiplier: newMultiplier,
                    lastMatchTime: currentTime,
                    maxCombo: Math.max(state.stats.combo.maxCombo, newComboCount),
                  };

                  dispatch({
                    type: GameActionType.UPDATE_COMBO,
                    payload: { combo: newCombo },
                  });
                } else {
                  // 콤보 윈도우 초과: 콤보 리셋하고 1부터 시작
                  const resetCombo: ComboState = {
                    count: 1,
                    multiplier: 1,
                    lastMatchTime: currentTime,
                    maxCombo: state.stats.combo.maxCombo,
                  };

                  dispatch({
                    type: GameActionType.UPDATE_COMBO,
                    payload: { combo: resetCombo },
                  });
                }
              }

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
                setTimeout(() => {
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
                }, 500);
              }
            } else {
              console.log('Match failed!');

              // 타임 어택 모드: 콤보 리셋
              if (state.config.mode === 'time_attack' && state.stats.combo) {
                dispatch({ type: GameActionType.RESET_COMBO });
              }

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
