# 구현 가이드

## 1. 시작하기 전에

### 1.1 필수 개발 도구
```bash
# Node.js 20+ 설치 확인
node --version

# 프로젝트 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 1.2 권장 VS Code 확장
- **ESLint** - 코드 품질 검사
- **Prettier** - 코드 포맷팅
- **Tailwind CSS IntelliSense** - Tailwind 자동완성
- **TypeScript Error Translator** - TS 에러 번역
- **Git Lens** - Git 기능 강화

---

## 2. 핵심 기능 구현 예제

### 2.1 게임 상태 관리 (Context + useReducer)

#### Step 1: 타입 정의
```typescript
// src/types/game.ts
export type GameMode = 'single' | 'versus';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';
export type GameStatus = 'idle' | 'ready' | 'playing' | 'paused' | 'finished';

export interface Card {
  id: string;
  pairId: string;
  imageUrl: string;
  deckId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  status: GameStatus;
  cards: Card[];
  flippedCards: string[];
  matchedCards: string[];
  moves: number;
  score: number;
  player1Score: number;
  player2Score: number;
  currentPlayer: 1 | 2;
  gameStartTime: number | null;
  gameEndTime: number | null;
  elapsedTime: number;
}

export type GameAction =
  | { type: 'START_GAME'; payload: { mode: GameMode; difficulty: Difficulty; cards: Card[] } }
  | { type: 'FLIP_CARD'; payload: { cardId: string } }
  | { type: 'MATCH_FOUND'; payload: { cardIds: string[] } }
  | { type: 'MATCH_FAILED' }
  | { type: 'RESET_FLIPPED' }
  | { type: 'SWITCH_PLAYER' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };
```

#### Step 2: Reducer 구현
```typescript
// src/store/gameReducer.ts
import { GameState, GameAction } from '../types/game';
import { calculateScore } from '../services/scoreCalculator';

export const initialGameState: GameState = {
  mode: 'single',
  difficulty: 'normal',
  status: 'idle',
  cards: [],
  flippedCards: [],
  matchedCards: [],
  moves: 0,
  score: 0,
  player1Score: 0,
  player2Score: 0,
  currentPlayer: 1,
  gameStartTime: null,
  gameEndTime: null,
  elapsedTime: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialGameState,
        mode: action.payload.mode,
        difficulty: action.payload.difficulty,
        cards: action.payload.cards,
        status: 'playing',
        gameStartTime: Date.now(),
      };

    case 'FLIP_CARD': {
      const { cardId } = action.payload;

      // 이미 2장이 뒤집혀있거나, 같은 카드 중복 클릭 방지
      if (state.flippedCards.length >= 2 || state.flippedCards.includes(cardId)) {
        return state;
      }

      // 이미 매칭된 카드는 클릭 불가
      if (state.matchedCards.includes(cardId)) {
        return state;
      }

      const newFlippedCards = [...state.flippedCards, cardId];

      return {
        ...state,
        flippedCards: newFlippedCards,
        cards: state.cards.map(card =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        ),
      };
    }

    case 'MATCH_FOUND': {
      const { cardIds } = action.payload;
      const scoreIncrement = calculateScore(state);

      const newState = {
        ...state,
        flippedCards: [],
        matchedCards: [...state.matchedCards, ...cardIds],
        moves: state.moves + 1,
        cards: state.cards.map(card =>
          cardIds.includes(card.id) ? { ...card, isMatched: true } : card
        ),
      };

      // 싱글 모드
      if (state.mode === 'single') {
        newState.score = state.score + scoreIncrement;
      }
      // 대전 모드
      else {
        if (state.currentPlayer === 1) {
          newState.player1Score = state.player1Score + 1;
        } else {
          newState.player2Score = state.player2Score + 1;
        }
        // 매칭 성공 시 턴 유지 (연속 기회)
      }

      // 게임 종료 체크
      if (newState.matchedCards.length === state.cards.length) {
        newState.status = 'finished';
        newState.gameEndTime = Date.now();
      }

      return newState;
    }

    case 'MATCH_FAILED':
      return {
        ...state,
        moves: state.moves + 1,
      };

    case 'RESET_FLIPPED':
      return {
        ...state,
        flippedCards: [],
        cards: state.cards.map(card =>
          card.isMatched ? card : { ...card, isFlipped: false }
        ),
        // 대전 모드: 매칭 실패 시 턴 전환
        currentPlayer: state.mode === 'versus'
          ? (state.currentPlayer === 1 ? 2 : 1) as 1 | 2
          : state.currentPlayer,
      };

    case 'SWITCH_PLAYER':
      return {
        ...state,
        currentPlayer: state.currentPlayer === 1 ? 2 : 1,
      };

    case 'PAUSE_GAME':
      return { ...state, status: 'paused' };

    case 'RESUME_GAME':
      return { ...state, status: 'playing' };

    case 'END_GAME':
      return {
        ...state,
        status: 'finished',
        gameEndTime: Date.now(),
      };

    case 'RESET_GAME':
      return initialGameState;

    default:
      return state;
  }
}
```

#### Step 3: Context Provider
```typescript
// src/store/GameContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction } from '../types/game';
import { gameReducer, initialGameState } from './gameReducer';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}
```

---

### 2.2 게임 엔진 로직

#### 카드 생성 및 셔플
```typescript
// src/services/gameEngine.ts
import { Card, Difficulty, GameMode } from '../types/game';
import { Deck } from '../types/deck';
import { shuffleArray } from '../utils/shuffle';

const GRID_SIZES = {
  easy: 12,    // 4x3 = 12장 (6쌍)
  normal: 16,  // 4x4 = 16장 (8쌍)
  hard: 24,    // 6x4 = 24장 (12쌍)
  expert: 36,  // 6x6 = 36장 (18쌍)
};

export function initializeGame(
  mode: GameMode,
  difficulty: Difficulty,
  deck: Deck
): Card[] {
  const cardCount = GRID_SIZES[difficulty];
  const pairCount = cardCount / 2;

  // 덱에서 필요한 만큼의 이미지 선택
  const selectedImages = deck.imageUrls.slice(0, pairCount);

  // 카드 쌍 생성
  const cards: Card[] = [];
  selectedImages.forEach((imageUrl, index) => {
    const pairId = `pair-${index}`;

    // 각 이미지당 2장의 카드 생성
    cards.push(
      {
        id: `card-${index}-a`,
        pairId,
        imageUrl,
        deckId: deck.id,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `card-${index}-b`,
        pairId,
        imageUrl,
        deckId: deck.id,
        isFlipped: false,
        isMatched: false,
      }
    );
  });

  // 카드 셔플 (Fisher-Yates)
  return shuffleArray(cards);
}

export function checkMatch(card1: Card, card2: Card): boolean {
  return card1.pairId === card2.pairId;
}

export function getGridLayout(difficulty: Difficulty): { rows: number; cols: number } {
  const layouts = {
    easy: { rows: 3, cols: 4 },
    normal: { rows: 4, cols: 4 },
    hard: { rows: 4, cols: 6 },
    expert: { rows: 6, cols: 6 },
  };
  return layouts[difficulty];
}
```

#### 점수 계산
```typescript
// src/services/scoreCalculator.ts
import { GameState } from '../types/game';

const BASE_SCORE = 100;
const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  normal: 1.5,
  hard: 2,
  expert: 3,
};

export function calculateScore(state: GameState): number {
  const { difficulty, moves } = state;

  // 이동 횟수가 적을수록 보너스
  const timeBonus = Math.max(0, 50 - moves);

  // 난이도 배수 적용
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty];

  return Math.round((BASE_SCORE + timeBonus) * multiplier);
}

export function calculateFinalScore(state: GameState): number {
  const { score, elapsedTime, moves, cards } = state;

  // 시간 보너스 (빠를수록 높음)
  const timeBonus = Math.max(0, 300 - elapsedTime); // 5분 기준

  // 완벽 보너스 (최소 이동 횟수로 완료)
  const perfectMoves = cards.length / 2;
  const moveBonus = moves === perfectMoves ? 500 : 0;

  return score + timeBonus + moveBonus;
}
```

#### 셔플 알고리즘 (Fisher-Yates)
```typescript
// src/utils/shuffle.ts
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
```

---

### 2.3 Custom Hooks

#### useGame Hook
```typescript
// src/hooks/useGame.ts
import { useCallback, useEffect } from 'react';
import { useGameContext } from '../store/GameContext';
import { checkMatch } from '../services/gameEngine';
import { Deck } from '../types/deck';
import { GameMode, Difficulty } from '../types/game';

export function useGame() {
  const { state, dispatch } = useGameContext();

  const startGame = useCallback((
    mode: GameMode,
    difficulty: Difficulty,
    deck: Deck
  ) => {
    const cards = initializeGame(mode, difficulty, deck);
    dispatch({
      type: 'START_GAME',
      payload: { mode, difficulty, cards },
    });
  }, [dispatch]);

  const flipCard = useCallback((cardId: string) => {
    if (state.status !== 'playing') return;
    if (state.flippedCards.length >= 2) return;

    dispatch({ type: 'FLIP_CARD', payload: { cardId } });
  }, [state.status, state.flippedCards.length, dispatch]);

  // 2장 뒤집혔을 때 매칭 체크
  useEffect(() => {
    if (state.flippedCards.length !== 2) return;

    const [id1, id2] = state.flippedCards;
    const card1 = state.cards.find(c => c.id === id1);
    const card2 = state.cards.find(c => c.id === id2);

    if (!card1 || !card2) return;

    if (checkMatch(card1, card2)) {
      // 매칭 성공
      setTimeout(() => {
        dispatch({
          type: 'MATCH_FOUND',
          payload: { cardIds: [id1, id2] }
        });
      }, 500);
    } else {
      // 매칭 실패 - 1초 후 다시 뒤집기
      setTimeout(() => {
        dispatch({ type: 'MATCH_FAILED' });
        dispatch({ type: 'RESET_FLIPPED' });
      }, 1000);
    }
  }, [state.flippedCards, state.cards, dispatch]);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, [dispatch]);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  return {
    state,
    startGame,
    flipCard,
    pauseGame,
    resumeGame,
    resetGame,
  };
}
```

#### useTimer Hook
```typescript
// src/hooks/useTimer.ts
import { useState, useEffect, useCallback } from 'react';

export function useTimer(isRunning: boolean) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const startTime = Date.now() - elapsedTime * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = useCallback(() => {
    setElapsedTime(0);
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    reset,
  };
}
```

#### useLocalStorage Hook
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

---

### 2.4 Card 컴포넌트 구현

```typescript
// src/components/game/Card/Card.tsx
import { motion } from 'framer-motion';
import { Card as CardType } from '../../../types/game';

interface CardProps {
  card: CardType;
  onClick: (id: string) => void;
  disabled: boolean;
}

export function Card({ card, onClick, disabled }: CardProps) {
  const handleClick = () => {
    if (disabled || card.isFlipped || card.isMatched) return;
    onClick(card.id);
  };

  return (
    <motion.div
      className="relative aspect-square cursor-pointer"
      onClick={handleClick}
      whileHover={!disabled && !card.isFlipped ? { scale: 1.05 } : {}}
      whileTap={!disabled && !card.isFlipped ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 카드 뒷면 */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-white text-4xl">?</span>
        </div>

        {/* 카드 앞면 */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            src={card.imageUrl}
            alt="Card"
            className={`w-full h-full object-cover ${
              card.isMatched ? 'opacity-50' : ''
            }`}
          />
          {card.isMatched && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/30">
              <span className="text-4xl">✓</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
```

---

### 2.5 GameBoard 컴포넌트

```typescript
// src/components/game/GameBoard/GameBoard.tsx
import { Card } from '../Card/Card';
import { Card as CardType, Difficulty } from '../../../types/game';
import { getGridLayout } from '../../../services/gameEngine';

interface GameBoardProps {
  cards: CardType[];
  difficulty: Difficulty;
  onCardClick: (id: string) => void;
  disabled: boolean;
}

export function GameBoard({ cards, difficulty, onCardClick, disabled }: GameBoardProps) {
  const { rows, cols } = getGridLayout(difficulty);

  return (
    <div
      className="grid gap-4 p-4 max-w-6xl mx-auto"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
```

---

## 3. 스타일링 가이드 (Tailwind CSS v4)

### 3.1 공통 유틸리티 클래스
```css
/* src/styles/animations.css */
@keyframes flip {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(180deg); }
}

@keyframes matched {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.flip-animation {
  animation: flip 0.6s ease-in-out;
}

.matched-animation {
  animation: matched 0.5s ease-in-out;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backfaceVisibility: hidden;
  -webkit-backface-visibility: hidden;
}
```

### 3.2 반응형 디자인 예제
```typescript
// 모바일, 태블릿, 데스크톱 대응
<div className="
  px-4 sm:px-6 lg:px-8
  py-4 sm:py-6 lg:py-8
  max-w-sm sm:max-w-2xl lg:max-w-6xl
  mx-auto
">
  {/* Content */}
</div>
```

---

## 4. 테스트 작성 가이드

### 4.1 단위 테스트 예제 (Vitest)
```typescript
// src/services/__tests__/gameEngine.test.ts
import { describe, it, expect } from 'vitest';
import { initializeGame, checkMatch } from '../gameEngine';
import { Deck } from '../../types/deck';

const mockDeck: Deck = {
  id: 'test-deck',
  name: 'Test Deck',
  description: 'For testing',
  category: 'historical',
  imageUrls: Array(20).fill('test.jpg'),
  thumbnailUrl: 'thumb.jpg',
  price: 0,
  isPremium: false,
  isOwned: true,
  releaseDate: '2025-01-01',
  tags: [],
};

describe('gameEngine', () => {
  describe('initializeGame', () => {
    it('should create correct number of cards for easy mode', () => {
      const cards = initializeGame('single', 'easy', mockDeck);
      expect(cards).toHaveLength(12);
    });

    it('should create pairs with matching pairIds', () => {
      const cards = initializeGame('single', 'easy', mockDeck);
      const pairIds = cards.map(c => c.pairId);
      const uniquePairIds = new Set(pairIds);

      expect(uniquePairIds.size).toBe(6); // 6 pairs for easy mode
    });

    it('should shuffle cards randomly', () => {
      const cards1 = initializeGame('single', 'easy', mockDeck);
      const cards2 = initializeGame('single', 'easy', mockDeck);

      const ids1 = cards1.map(c => c.id);
      const ids2 = cards2.map(c => c.id);

      expect(ids1).not.toEqual(ids2);
    });
  });

  describe('checkMatch', () => {
    it('should return true for matching cards', () => {
      const card1 = { pairId: 'pair-1', id: 'card-1' };
      const card2 = { pairId: 'pair-1', id: 'card-2' };

      expect(checkMatch(card1, card2)).toBe(true);
    });

    it('should return false for non-matching cards', () => {
      const card1 = { pairId: 'pair-1', id: 'card-1' };
      const card2 = { pairId: 'pair-2', id: 'card-2' };

      expect(checkMatch(card1, card2)).toBe(false);
    });
  });
});
```

---

## 5. 배포 가이드

### 5.1 Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 5.2 환경 변수 설정
```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 6. 성능 최적화 체크리스트

- [ ] 이미지 WebP 포맷 변환
- [ ] 이미지 Lazy Loading
- [ ] Code Splitting (React.lazy)
- [ ] React.memo로 불필요한 리렌더 방지
- [ ] useMemo/useCallback 적절히 사용
- [ ] Lighthouse 점수 90+ 달성
- [ ] Bundle 사이즈 < 500KB
- [ ] First Contentful Paint < 1.5s

---

## 7. 다음 단계

1. **Phase 1 시작**: 프로젝트 셋업 및 기본 UI
2. **주간 리뷰**: 매주 금요일 진행 상황 점검
3. **문서 업데이트**: 구현하면서 배운 내용 문서화
4. **테스트 작성**: 각 기능 구현 후 테스트 추가

기술 스택, 아키텍처, 로드맵이 모두 준비되었습니다. 이제 개발을 시작할 수 있습니다! 🚀
