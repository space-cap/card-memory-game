# 아키텍처 설계 문서

## 1. 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Client Application                    │
│                   (React 19 + TypeScript)                │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer    │    Business Logic Layer        │
│  - Components          │    - Game Engine               │
│  - UI/UX               │    - State Management          │
│  - Animations          │    - Utils & Helpers           │
├─────────────────────────────────────────────────────────┤
│               Data Access Layer                          │
│  - API Client          │    - Local Storage             │
│  - Cache Management    │    - Session Storage           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Backend API (Future)                   │
│  - Authentication      │    - Payment Gateway           │
│  - User Management     │    - Analytics                 │
│  - Content Management  │    - Database                  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 프론트엔드 아키텍처

### 2.1 디렉토리 구조

```
src/
├── components/           # React 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── game/            # 게임 관련 컴포넌트
│   │   ├── Card/
│   │   ├── GameBoard/
│   │   ├── ScoreBoard/
│   │   └── Timer/
│   ├── deck/            # 덱 관련 컴포넌트
│   │   ├── DeckSelector/
│   │   ├── DeckCard/
│   │   └── DeckShop/
│   └── layout/          # 레이아웃 컴포넌트
│       ├── Header/
│       ├── Footer/
│       └── MainLayout/
│
├── pages/               # 페이지 컴포넌트
│   ├── HomePage/
│   ├── GamePage/
│   ├── SettingsPage/
│   ├── ShopPage/
│   └── ProfilePage/
│
├── hooks/               # Custom Hooks
│   ├── useGame.ts
│   ├── useTimer.ts
│   ├── usePoints.ts
│   └── useLocalStorage.ts
│
├── store/               # 상태 관리
│   ├── gameStore.ts     # 게임 상태
│   ├── userStore.ts     # 사용자 상태
│   ├── deckStore.ts     # 덱 상태
│   └── index.ts
│
├── services/            # 비즈니스 로직
│   ├── gameEngine.ts    # 게임 엔진 로직
│   ├── shuffleAlgorithm.ts
│   ├── scoreCalculator.ts
│   └── api/             # API 클라이언트
│       ├── auth.ts
│       ├── decks.ts
│       └── payments.ts
│
├── types/               # TypeScript 타입 정의
│   ├── game.ts
│   ├── deck.ts
│   ├── user.ts
│   └── index.ts
│
├── utils/               # 유틸리티 함수
│   ├── storage.ts
│   ├── animations.ts
│   └── validators.ts
│
├── constants/           # 상수 정의
│   ├── game.ts
│   ├── routes.ts
│   └── config.ts
│
├── assets/              # 정적 리소스
│   ├── images/
│   │   └── decks/
│   │       ├── historical/
│   │       ├── celebrity/
│   │       └── animals/
│   └── sounds/
│       ├── flip.mp3
│       ├── match.mp3
│       └── win.mp3
│
└── styles/              # 스타일
    ├── index.css        # Global + Tailwind
    └── animations.css   # 커스텀 애니메이션
```

---

## 3. 컴포넌트 아키텍처

### 3.1 컴포넌트 계층 구조

```
App
├── Router
    ├── HomePage
    │   ├── ModeSelector (싱글/대전 선택)
    │   └── QuickStats (통계 요약)
    │
    ├── GamePage
    │   ├── GameHeader
    │   │   ├── Timer
    │   │   ├── MoveCounter
    │   │   └── ScoreBoard
    │   ├── GameBoard
    │   │   └── Card[] (동적 생성)
    │   ├── GameControls
    │   │   ├── PauseButton
    │   │   ├── RestartButton
    │   │   └── QuitButton
    │   └── GameResultModal
    │
    ├── SettingsPage
    │   ├── DifficultySelector
    │   ├── DeckSelector
    │   └── SoundToggle
    │
    ├── ShopPage
    │   ├── PointsDisplay
    │   ├── DeckGrid
    │   │   └── DeckCard[]
    │   └── PaymentModal
    │
    └── ProfilePage
        ├── UserStats
        ├── AchievementsList
        └── PurchaseHistory
```

### 3.2 핵심 컴포넌트 명세

#### Card Component
```typescript
interface CardProps {
  id: string;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: string) => void;
  disabled: boolean;
}
```

**역할**: 개별 카드 표시 및 뒤집기 애니메이션
**상태**: isFlipped, isMatched
**이벤트**: onClick (카드 클릭)

#### GameBoard Component
```typescript
interface GameBoardProps {
  cards: Card[];
  onCardClick: (id: string) => void;
  gridSize: GridSize; // 4x3, 4x4, 6x4, 6x6
}
```

**역할**: 카드 배치 및 그리드 레이아웃 관리
**로직**: 카드 셔플, 그리드 크기에 따른 반응형 레이아웃

#### Timer Component
```typescript
interface TimerProps {
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
  initialTime?: number;
}
```

**역할**: 게임 진행 시간 측정
**기능**: 시작/일시정지/리셋

#### ScoreBoard Component (대전 모드)
```typescript
interface ScoreBoardProps {
  player1Score: number;
  player2Score: number;
  currentPlayer: 1 | 2;
}
```

**역할**: 대전 모드에서 양 플레이어 점수 표시
**기능**: 현재 턴 플레이어 강조

---

## 4. 상태 관리 아키텍처

### 4.1 상태 관리 전략

**Context API + useReducer** 조합 사용 (단순성 우선)

```typescript
// Game Context
interface GameState {
  mode: 'single' | 'versus';
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  cards: Card[];
  flippedCards: string[];
  matchedCards: string[];
  moves: number;
  score: number;
  player1Score: number;
  player2Score: number;
  currentPlayer: 1 | 2;
  isGameActive: boolean;
  gameStartTime: number | null;
  gameEndTime: number | null;
}

type GameAction =
  | { type: 'START_GAME'; payload: { mode: string; difficulty: string } }
  | { type: 'FLIP_CARD'; payload: { cardId: string } }
  | { type: 'MATCH_FOUND'; payload: { cardIds: string[] } }
  | { type: 'RESET_FLIPPED' }
  | { type: 'SWITCH_PLAYER' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };
```

### 4.2 주요 상태 도메인

#### 1. Game State (게임 진행 상태)
- 현재 게임 모드, 난이도
- 카드 배열 및 상태
- 점수, 이동 횟수, 시간

#### 2. User State (사용자 정보)
- 프로필 정보
- 포인트 잔액
- 구매한 덱 목록
- 최고 기록

#### 3. Deck State (덱 관리)
- 사용 가능한 덱 목록
- 선택된 덱
- 덱 이미지 경로

---

## 5. 게임 엔진 로직

### 5.1 게임 흐름 (State Machine)

```
[IDLE]
  → START_GAME → [READY]
  → (카드 셔플) → [PLAYING]
  → 카드 클릭 → FLIP_CARD
    → 2장 뒤집힘?
      → 매칭 확인
        → ✅ MATCH_FOUND → 점수 증가
        → ❌ RESET_FLIPPED → 카드 다시 뒤집기
  → 모든 카드 매칭? → [GAME_OVER]
  → 결과 표시 → [IDLE]
```

### 5.2 카드 매칭 알고리즘

```typescript
function checkMatch(
  card1: Card,
  card2: Card
): boolean {
  return card1.pairId === card2.pairId;
}

function handleCardFlip(cardId: string, state: GameState): GameState {
  // 1. 이미 2장이 뒤집혀있으면 무시
  if (state.flippedCards.length === 2) return state;

  // 2. 같은 카드 중복 클릭 방지
  if (state.flippedCards.includes(cardId)) return state;

  // 3. 카드 뒤집기
  const newFlipped = [...state.flippedCards, cardId];

  // 4. 2장이 되면 매칭 체크
  if (newFlipped.length === 2) {
    const [id1, id2] = newFlipped;
    const card1 = state.cards.find(c => c.id === id1);
    const card2 = state.cards.find(c => c.id === id2);

    if (checkMatch(card1, card2)) {
      // 매칭 성공
      return {
        ...state,
        flippedCards: [],
        matchedCards: [...state.matchedCards, id1, id2],
        score: state.score + calculateScore(state),
        moves: state.moves + 1
      };
    } else {
      // 매칭 실패 - 1초 후 다시 뒤집기
      setTimeout(() => {
        dispatch({ type: 'RESET_FLIPPED' });
      }, 1000);

      return {
        ...state,
        moves: state.moves + 1
      };
    }
  }

  return { ...state, flippedCards: newFlipped };
}
```

### 5.3 점수 계산 로직

```typescript
function calculateScore(state: GameState): number {
  const baseScore = 100;
  const timeBonus = Math.max(0, 50 - state.moves); // 이동 횟수가 적을수록 보너스
  const difficultyMultiplier = {
    'easy': 1,
    'normal': 1.5,
    'hard': 2,
    'expert': 3
  };

  return Math.round(
    (baseScore + timeBonus) * difficultyMultiplier[state.difficulty]
  );
}
```

---

## 6. 데이터 흐름

### 6.1 게임 시작 시퀀스

```
User → ModeSelector 클릭
  → GameContext.dispatch({ type: 'START_GAME', payload: { mode, difficulty } })
  → gameEngine.initializeGame(mode, difficulty, selectedDeck)
    → deckService.loadDeckImages(selectedDeck)
    → shuffleAlgorithm.shuffle(cards)
    → GameContext.state 업데이트
  → GamePage 렌더링
  → GameBoard 카드 배치
```

### 6.2 카드 매칭 시퀀스

```
User → Card 클릭
  → Card.onClick(cardId)
  → GameContext.dispatch({ type: 'FLIP_CARD', payload: { cardId } })
  → gameEngine.handleCardFlip(cardId, currentState)
    → 매칭 체크
      → ✅ dispatch({ type: 'MATCH_FOUND' })
        → 점수 업데이트
        → 사운드 재생 (match.mp3)
        → 매칭 애니메이션
      → ❌ 1초 후 카드 다시 뒤집기
        → dispatch({ type: 'RESET_FLIPPED' })
    → 게임 종료 체크
      → 모든 카드 매칭 완료?
        → dispatch({ type: 'END_GAME' })
        → 결과 모달 표시
        → 포인트 지급
        → localStorage에 기록 저장
```

---

## 7. 성능 최적화 전략

### 7.1 렌더링 최적화
- `React.memo`로 Card 컴포넌트 메모이제이션
- `useMemo`로 카드 배열 계산 캐싱
- `useCallback`으로 이벤트 핸들러 안정화
- Virtual Scrolling (덱 목록이 많을 경우)

### 7.2 이미지 최적화
- WebP 포맷 사용
- 반응형 이미지 (srcset)
- Lazy Loading
- 이미지 CDN 활용 (향후)

### 7.3 번들 최적화
- Code Splitting (React.lazy)
- Dynamic Import (라우트별)
- Tree Shaking
- CSS Purging (Tailwind)

---

## 8. 보안 고려사항

### 8.1 클라이언트 보안
- XSS 방어: 사용자 입력 sanitization
- CSRF 토큰 사용
- Content Security Policy 설정

### 8.2 결제 보안
- 결제 정보는 클라이언트에 저장하지 않음
- HTTPS 필수
- 결제 게이트웨이 API 사용 (PG사 SDK)

### 8.3 API 보안 (향후)
- JWT 기반 인증
- Rate Limiting
- API 요청 암호화

---

## 9. 확장성 고려사항

### 9.1 다국어 지원 구조
```typescript
// i18n 준비
const translations = {
  ko: { /* 한국어 */ },
  en: { /* English */ },
  ja: { /* 日本語 */ }
};
```

### 9.2 테마 시스템
```typescript
// Tailwind CSS variables
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
}

[data-theme="dark"] {
  --color-background: #1a1a1a;
}
```

### 9.3 플러그인 아키텍처
새로운 게임 모드나 덱 타입을 쉽게 추가할 수 있는 구조

```typescript
interface DeckPlugin {
  id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
}

// 덱 등록
deckRegistry.register(historicalDeck);
deckRegistry.register(celebrityDeck);
```

---

## 10. 테스트 전략

### 10.1 테스트 레이어
- **Unit Tests**: 게임 엔진 로직, 유틸 함수
- **Integration Tests**: 컴포넌트 상호작용
- **E2E Tests**: 전체 게임 플레이 시나리오

### 10.2 주요 테스트 케이스
- 카드 매칭 로직
- 점수 계산 로직
- 게임 상태 전환
- 대전 모드 턴 전환
- 결제 플로우

---

## 11. 모니터링 및 분석

### 11.1 추적할 메트릭
- 게임 완료율
- 평균 게임 시간
- 난이도별 선호도
- 덱 구매 전환율
- 오류 발생률

### 11.2 도구
- Google Analytics (사용자 행동)
- Sentry (에러 추적)
- Lighthouse (성능 모니터링)
