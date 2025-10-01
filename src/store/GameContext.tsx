import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from '../types/game';
import { GameMode, Difficulty } from '../types/game';
import { gameReducer } from './gameReducer';

/**
 * 초기 게임 상태
 */
const initialGameState: GameState = {
  config: {
    mode: GameMode.SINGLE,
    difficulty: Difficulty.EASY,
    deckId: 'default',
  },
  status: 'idle' as const,
  cards: [],
  players: [],
  currentPlayerId: undefined,
  revealedCards: [],
  stats: {
    moves: 0,
    matches: 0,
    timeElapsed: 0,
    startTime: 0,
  },
};

/**
 * 게임 컨텍스트 타입
 */
interface GameContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

/**
 * 게임 컨텍스트
 */
const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * 게임 프로바이더 Props
 */
interface GameProviderProps {
  children: ReactNode;
}

/**
 * 게임 상태 프로바이더
 */
export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * 게임 컨텍스트 훅
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }

  return context;
}
