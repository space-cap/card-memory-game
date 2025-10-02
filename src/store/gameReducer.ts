import type { GameState } from '../types/game';
import type { GameAction } from '../types/game';
import { GameStatus, CardState, GameActionType } from '../types/game';
import { calculateScore } from '../services/scoreCalculator';
import { getNextPlayer } from '../services/gameEngine';

/**
 * 게임 상태 리듀서
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case GameActionType.INIT_GAME:
      return {
        ...action.payload,
        status: GameStatus.IDLE,
        revealedCards: [],
        stats: {
          moves: 0,
          matches: 0,
          timeElapsed: 0,
          startTime: 0,
        },
      };

    case GameActionType.START_GAME:
      return {
        ...state,
        status: GameStatus.PLAYING,
        stats: {
          ...state.stats,
          startTime: Date.now(),
        },
      };

    case GameActionType.PAUSE_GAME:
      return {
        ...state,
        status: GameStatus.PAUSED,
      };

    case GameActionType.RESUME_GAME:
      return {
        ...state,
        status: GameStatus.PLAYING,
      };

    case GameActionType.FLIP_CARD: {
      const { cardId } = action.payload;

      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, state: CardState.REVEALED } : card
        ),
        revealedCards: [...state.revealedCards, cardId],
        stats: {
          ...state.stats,
          moves: state.stats.moves + 1,
        },
      };
    }

    case GameActionType.MATCH_CARDS: {
      console.log('MATCH_CARDS reducer called, clearing revealedCards');
      const { cardIds } = action.payload;
      if (!state.players || state.players.length === 0) {
        console.warn('No players found, returning state');
        return state;
      }

      const currentPlayer = state.players.find((p) => p.id === state.currentPlayerId);

      const newState = {
        ...state,
        cards: state.cards.map((card) =>
          cardIds.includes(card.id) ? { ...card, state: CardState.MATCHED } : card
        ),
        revealedCards: [],
        stats: {
          ...state.stats,
          matches: state.stats.matches + 1,
        },
        players: state.players.map((player) =>
          player.id === state.currentPlayerId
            ? {
                ...player,
                matches: player.matches + 1,
                score: currentPlayer
                  ? calculateScore(
                      player.matches + 1,
                      state.stats.moves,
                      state.stats.timeElapsed,
                      state.config.difficulty
                    )
                  : player.score,
              }
            : player
        ),
      };

      console.log('MATCH_CARDS new revealedCards:', newState.revealedCards);
      return newState;
    }

    case GameActionType.UNMATCH_CARDS: {
      return {
        ...state,
        cards: state.cards.map((card) =>
          state.revealedCards.includes(card.id) ? { ...card, state: CardState.HIDDEN } : card
        ),
        revealedCards: [],
      };
    }

    case GameActionType.UPDATE_TIME: {
      const { timeElapsed } = action.payload;
      return {
        ...state,
        stats: {
          ...state.stats,
          timeElapsed,
        },
      };
    }

    case GameActionType.END_GAME: {
      const { finalScore } = action.payload;
      if (!state.players || state.players.length === 0) {
        return { ...state, status: GameStatus.FINISHED };
      }

      return {
        ...state,
        status: GameStatus.FINISHED,
        stats: {
          ...state.stats,
          endTime: Date.now(),
        },
        players: state.players.map((player, index) =>
          index === 0 ? { ...player, score: finalScore } : player
        ),
      };
    }

    case GameActionType.SWITCH_PLAYER: {
      return {
        ...state,
        currentPlayerId: getNextPlayer(state),
      };
    }

    case GameActionType.RESET_GAME: {
      if (!state.players || state.players.length === 0) {
        return {
          ...state,
          status: GameStatus.IDLE,
          cards: state.cards.map((card) => ({ ...card, state: CardState.HIDDEN })),
          revealedCards: [],
          stats: {
            moves: 0,
            matches: 0,
            timeElapsed: 0,
            startTime: 0,
          },
        };
      }

      return {
        ...state,
        status: GameStatus.IDLE,
        cards: state.cards.map((card) => ({ ...card, state: CardState.HIDDEN })),
        revealedCards: [],
        players: state.players.map((player) => ({ ...player, score: 0, matches: 0 })),
        stats: {
          moves: 0,
          matches: 0,
          timeElapsed: 0,
          startTime: 0,
        },
      };
    }

    default:
      return state;
  }
}
