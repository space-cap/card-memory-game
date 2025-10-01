# 데이터 모델 및 API 명세서

## 1. 데이터 모델 (TypeScript Interfaces)

### 1.1 게임 관련 타입

```typescript
// ===== Card =====
interface Card {
  id: string;                    // 고유 ID (uuid)
  pairId: string;                // 매칭 쌍 ID (같은 그림의 카드는 같은 pairId)
  imageUrl: string;              // 이미지 경로
  deckId: string;                // 속한 덱 ID
  isFlipped: boolean;            // 뒤집힌 상태
  isMatched: boolean;            // 매칭된 상태
}

// ===== Game State =====
interface GameState {
  // 게임 설정
  mode: GameMode;                // 'single' | 'versus'
  difficulty: Difficulty;        // 'easy' | 'normal' | 'hard' | 'expert'
  selectedDeckId: string;        // 선택된 덱 ID

  // 게임 진행 상태
  status: GameStatus;            // 'idle' | 'ready' | 'playing' | 'paused' | 'finished'
  cards: Card[];                 // 카드 배열
  flippedCards: string[];        // 현재 뒤집힌 카드 ID 배열 (최대 2개)
  matchedCards: string[];        // 매칭 완료된 카드 ID 배열

  // 점수 및 통계
  moves: number;                 // 이동 횟수
  score: number;                 // 점수 (싱글 모드)
  player1Score: number;          // 플레이어 1 점수 (대전 모드)
  player2Score: number;          // 플레이어 2 점수 (대전 모드)
  currentPlayer: 1 | 2;          // 현재 턴 플레이어 (대전 모드)

  // 시간 측정
  gameStartTime: number | null;  // 게임 시작 시각 (timestamp)
  gameEndTime: number | null;    // 게임 종료 시각 (timestamp)
  elapsedTime: number;           // 경과 시간 (초)
}

// ===== Game Config =====
interface GameConfig {
  mode: GameMode;
  difficulty: Difficulty;
  deckId: string;
  soundEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

// ===== Game Result =====
interface GameResult {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  deckId: string;
  score: number;
  moves: number;
  elapsedTime: number;
  completedAt: string;           // ISO 8601 timestamp
  winner?: 1 | 2;                // 대전 모드 승자
  player1Score?: number;
  player2Score?: number;
}

// ===== Type Unions =====
type GameMode = 'single' | 'versus';
type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';
type GameStatus = 'idle' | 'ready' | 'playing' | 'paused' | 'finished';
```

### 1.2 덱(Deck) 관련 타입

```typescript
// ===== Deck =====
interface Deck {
  id: string;                    // 고유 ID
  name: string;                  // 덱 이름 (예: "역사적 인물")
  description: string;           // 설명
  category: DeckCategory;        // 카테고리
  imageUrls: string[];           // 카드 이미지 경로 배열 (최소 18장)
  thumbnailUrl: string;          // 썸네일 이미지
  price: number;                 // 가격 (포인트) - 0이면 무료
  isPremium: boolean;            // 프리미엄 여부
  isOwned: boolean;              // 사용자 소유 여부 (클라이언트 상태)
  releaseDate: string;           // 출시일 (ISO 8601)
  tags: string[];                // 태그 (예: ["history", "education"])
}

type DeckCategory =
  | 'historical'                 // 역사적 인물
  | 'celebrity'                  // 연예인
  | 'advertisement'              // 광고/브랜드
  | 'animation'                  // 애니메이션
  | 'nature'                     // 동물/자연
  | 'art'                        // 예술/미술
  | 'sports';                    // 스포츠

// ===== Deck Filter =====
interface DeckFilter {
  category?: DeckCategory;
  isPremium?: boolean;
  priceRange?: [number, number];
  searchQuery?: string;
}
```

### 1.3 사용자(User) 관련 타입

```typescript
// ===== User =====
interface User {
  id: string;                    // 고유 ID
  username: string;              // 사용자명
  email: string;                 // 이메일
  avatarUrl?: string;            // 프로필 이미지
  points: number;                // 보유 포인트
  level: number;                 // 레벨
  experiencePoints: number;      // 경험치
  createdAt: string;             // 가입일 (ISO 8601)
  lastLoginAt: string;           // 마지막 로그인 (ISO 8601)
}

// ===== User Stats =====
interface UserStats {
  userId: string;
  totalGamesPlayed: number;      // 총 게임 수
  totalWins: number;             // 승리 수 (대전 모드)
  totalLosses: number;           // 패배 수 (대전 모드)
  winRate: number;               // 승률 (%)
  averageScore: number;          // 평균 점수
  bestScore: number;             // 최고 점수
  totalPlayTime: number;         // 총 플레이 시간 (초)

  // 난이도별 통계
  statsByDifficulty: {
    easy: DifficultyStats;
    normal: DifficultyStats;
    hard: DifficultyStats;
    expert: DifficultyStats;
  };

  // 최근 게임 기록
  recentGames: GameResult[];     // 최근 10개
}

interface DifficultyStats {
  gamesPlayed: number;
  bestScore: number;
  bestTime: number;              // 최단 시간 (초)
  averageMoves: number;
}

// ===== Achievement =====
interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;           // 달성 시각 (ISO 8601)
  isUnlocked: boolean;
  criteria: {
    type: 'games_played' | 'score' | 'time' | 'wins' | 'deck_collection';
    target: number;
    current: number;
  };
}
```

### 1.4 결제(Payment) 관련 타입

```typescript
// ===== Purchase =====
interface Purchase {
  id: string;                    // 거래 ID
  userId: string;
  purchaseType: PurchaseType;
  itemId: string;                // 덱 ID 또는 포인트 패키지 ID
  itemName: string;
  price: number;                 // 실제 결제 금액 (원화)
  pointsAwarded?: number;        // 지급된 포인트 (포인트 구매 시)
  paymentMethod: PaymentMethod;
  status: PurchaseStatus;
  createdAt: string;             // 구매 시각 (ISO 8601)
  completedAt?: string;          // 완료 시각
}

type PurchaseType = 'deck' | 'points' | 'subscription';
type PaymentMethod = 'credit_card' | 'kakaopay' | 'naverpay' | 'points';
type PurchaseStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// ===== Points Package =====
interface PointsPackage {
  id: string;
  name: string;                  // 예: "스타터 팩"
  points: number;                // 지급 포인트
  price: number;                 // 가격 (원화)
  bonusPercentage: number;       // 보너스 비율 (예: 10% → 0.1)
  isPopular: boolean;            // 인기 상품 여부
}

// ===== Subscription Plan =====
interface SubscriptionPlan {
  id: string;
  name: string;                  // 예: "프리미엄 월간"
  description: string;
  price: number;                 // 월 구독료
  duration: number;              // 기간 (일)
  benefits: string[];            // 혜택 목록
  isActive: boolean;
}
```

---

## 2. 로컬 스토리지 스키마

### 2.1 저장 키 및 데이터 구조

```typescript
// ===== localStorage keys =====
const STORAGE_KEYS = {
  // 게임 설정
  GAME_CONFIG: 'cardgame_config',
  SOUND_ENABLED: 'cardgame_sound',

  // 사용자 기록
  BEST_SCORES: 'cardgame_best_scores',
  GAME_HISTORY: 'cardgame_history',

  // 덱 정보
  OWNED_DECKS: 'cardgame_owned_decks',
  SELECTED_DECK: 'cardgame_selected_deck',

  // 인증 (향후)
  AUTH_TOKEN: 'cardgame_auth_token',
  USER_ID: 'cardgame_user_id',
} as const;

// ===== 저장 데이터 예시 =====

// cardgame_config
interface StoredGameConfig {
  difficulty: Difficulty;
  soundEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  theme: 'light' | 'dark';
}

// cardgame_best_scores
interface StoredBestScores {
  [difficulty: string]: {
    score: number;
    moves: number;
    time: number;
    date: string;
  };
}

// cardgame_history (최근 50개만 저장)
interface StoredGameHistory {
  games: GameResult[];
}

// cardgame_owned_decks
interface StoredOwnedDecks {
  deckIds: string[];             // 소유한 덱 ID 배열
  purchaseDates: Record<string, string>; // { deckId: ISO date }
}
```

---

## 3. API 명세서 (Backend - 향후 구현)

### 3.1 인증 API

#### POST /api/auth/register
**요청**:
```typescript
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
```

**응답**:
```typescript
interface AuthResponse {
  user: User;
  token: string;                 // JWT
  expiresIn: number;             // 토큰 만료 시간 (초)
}
```

#### POST /api/auth/login
**요청**:
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**응답**: `AuthResponse`

#### POST /api/auth/logout
**헤더**: `Authorization: Bearer {token}`

**응답**: `{ success: boolean }`

---

### 3.2 사용자 API

#### GET /api/users/me
**헤더**: `Authorization: Bearer {token}`

**응답**: `User`

#### GET /api/users/me/stats
**헤더**: `Authorization: Bearer {token}`

**응답**: `UserStats`

#### PUT /api/users/me
**헤더**: `Authorization: Bearer {token}`

**요청**:
```typescript
interface UpdateUserRequest {
  username?: string;
  avatarUrl?: string;
}
```

**응답**: `User`

#### GET /api/users/me/achievements
**헤더**: `Authorization: Bearer {token}`

**응답**:
```typescript
interface AchievementsResponse {
  achievements: Achievement[];
  totalUnlocked: number;
  totalAvailable: number;
}
```

---

### 3.3 게임 API

#### POST /api/games
**헤더**: `Authorization: Bearer {token}`

**요청**:
```typescript
interface CreateGameRequest {
  mode: GameMode;
  difficulty: Difficulty;
  deckId: string;
}
```

**응답**:
```typescript
interface CreateGameResponse {
  gameId: string;
  cards: Card[];                 // 서버에서 셔플된 카드
}
```

#### POST /api/games/{gameId}/complete
**헤더**: `Authorization: Bearer {token}`

**요청**:
```typescript
interface CompleteGameRequest {
  score: number;
  moves: number;
  elapsedTime: number;
  winner?: 1 | 2;                // 대전 모드
}
```

**응답**:
```typescript
interface CompleteGameResponse {
  result: GameResult;
  pointsEarned: number;
  newAchievements: Achievement[];
  newLevel?: number;             // 레벨업 했을 경우
}
```

#### GET /api/games/history
**헤더**: `Authorization: Bearer {token}`

**쿼리 파라미터**:
- `limit`: number (기본값: 20)
- `offset`: number (기본값: 0)
- `mode`: GameMode (선택)
- `difficulty`: Difficulty (선택)

**응답**:
```typescript
interface GameHistoryResponse {
  games: GameResult[];
  total: number;
  hasMore: boolean;
}
```

---

### 3.4 덱 API

#### GET /api/decks
**쿼리 파라미터**:
- `category`: DeckCategory (선택)
- `isPremium`: boolean (선택)
- `search`: string (선택)

**응답**:
```typescript
interface DecksResponse {
  decks: Deck[];
  total: number;
}
```

#### GET /api/decks/{deckId}
**응답**: `Deck`

#### GET /api/decks/owned
**헤더**: `Authorization: Bearer {token}`

**응답**:
```typescript
interface OwnedDecksResponse {
  decks: Deck[];
}
```

---

### 3.5 결제 API

#### GET /api/shop/decks
**헤더**: `Authorization: Bearer {token}`

**응답**:
```typescript
interface ShopDecksResponse {
  decks: Deck[];
  userPoints: number;
}
```

#### POST /api/shop/decks/{deckId}/purchase
**헤더**: `Authorization: Bearer {token}`

**요청**:
```typescript
interface PurchaseDeckRequest {
  paymentMethod: PaymentMethod;
}
```

**응답**:
```typescript
interface PurchaseDeckResponse {
  purchase: Purchase;
  newBalance: number;            // 남은 포인트
  deck: Deck;
}
```

#### GET /api/shop/points-packages
**응답**:
```typescript
interface PointsPackagesResponse {
  packages: PointsPackage[];
}
```

#### POST /api/shop/points/purchase
**헤더**: `Authorization: Bearer {token}`

**요청**:
```typescript
interface PurchasePointsRequest {
  packageId: string;
  paymentMethod: PaymentMethod;
}
```

**응답**:
```typescript
interface PurchasePointsResponse {
  purchase: Purchase;
  newBalance: number;
}
```

#### GET /api/purchases/history
**헤더**: `Authorization: Bearer {token}`

**쿼리 파라미터**:
- `limit`: number (기본값: 20)
- `offset`: number (기본값: 0)

**응답**:
```typescript
interface PurchaseHistoryResponse {
  purchases: Purchase[];
  total: number;
  hasMore: boolean;
}
```

---

### 3.6 포인트 API

#### GET /api/points/balance
**헤더**: `Authorization: Bearer {token}`

**응답**:
```typescript
interface PointsBalanceResponse {
  balance: number;
  earnedToday: number;
  dailyLimit: number;
}
```

#### POST /api/points/earn
**헤더**: `Authorization: Bearer {token}`

**요청**:
```typescript
interface EarnPointsRequest {
  source: 'game_completion' | 'daily_login' | 'ad_watch' | 'achievement';
  amount: number;
  metadata?: Record<string, any>;
}
```

**응답**:
```typescript
interface EarnPointsResponse {
  newBalance: number;
  earnedAmount: number;
}
```

---

## 4. 에러 코드 정의

```typescript
enum ErrorCode {
  // 인증 관련
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 사용자 관련
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // 게임 관련
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  INVALID_GAME_STATE = 'INVALID_GAME_STATE',

  // 덱 관련
  DECK_NOT_FOUND = 'DECK_NOT_FOUND',
  DECK_ALREADY_OWNED = 'DECK_ALREADY_OWNED',

  // 결제 관련
  INSUFFICIENT_POINTS = 'INSUFFICIENT_POINTS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PURCHASE_NOT_FOUND = 'PURCHASE_NOT_FOUND',

  // 일반
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
}

// 응답 형식
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

---

## 5. 데이터 유효성 검증 규칙

```typescript
// ===== Validation Rules =====
const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 100,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
  },
  deckName: {
    minLength: 2,
    maxLength: 50,
  },
  deckImages: {
    minCount: 18,                // 최소 18개 이미지 (36장 Expert 모드 대응)
    maxCount: 100,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  points: {
    min: 0,
    max: 1000000,
  },
} as const;

// ===== Validation Functions =====
function validateUsername(username: string): boolean {
  const { minLength, maxLength, pattern } = VALIDATION_RULES.username;
  return (
    username.length >= minLength &&
    username.length <= maxLength &&
    pattern.test(username)
  );
}

function validateEmail(email: string): boolean {
  return VALIDATION_RULES.email.pattern.test(email);
}
```

---

## 6. 데이터베이스 스키마 (참고용 - 향후 구현)

### 6.1 PostgreSQL 스키마

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  points INTEGER DEFAULT 0 CHECK (points >= 0),
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Decks Table
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  image_urls TEXT[] NOT NULL,
  thumbnail_url TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  release_date TIMESTAMP DEFAULT NOW(),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Decks (소유 관계)
CREATE TABLE user_decks (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, deck_id)
);

-- Games Table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mode VARCHAR(20) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  deck_id UUID REFERENCES decks(id),
  score INTEGER NOT NULL,
  moves INTEGER NOT NULL,
  elapsed_time INTEGER NOT NULL,
  winner INTEGER,
  player1_score INTEGER,
  player2_score INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Purchases Table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  purchase_type VARCHAR(50) NOT NULL,
  item_id UUID,
  item_name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  points_awarded INTEGER,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Achievements Table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria_type VARCHAR(50) NOT NULL,
  criteria_target INTEGER NOT NULL
);

-- User Achievements
CREATE TABLE user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_completed_at ON games(completed_at);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_user_decks_user_id ON user_decks(user_id);
```

---

## 7. 샘플 데이터

### 7.1 기본 무료 덱

```typescript
const defaultDecks: Deck[] = [
  {
    id: 'deck-historical-001',
    name: '역사적 인물',
    description: '세계를 바꾼 위대한 인물들',
    category: 'historical',
    imageUrls: [
      '/assets/decks/historical/einstein.jpg',
      '/assets/decks/historical/newton.jpg',
      '/assets/decks/historical/curie.jpg',
      // ... 18개 이미지
    ],
    thumbnailUrl: '/assets/decks/historical/thumbnail.jpg',
    price: 0,
    isPremium: false,
    isOwned: true,
    releaseDate: '2025-01-01T00:00:00Z',
    tags: ['history', 'education', 'free'],
  },
  {
    id: 'deck-nature-001',
    name: '동물 친구들',
    description: '귀여운 동물들의 세계',
    category: 'nature',
    imageUrls: [
      '/assets/decks/nature/cat.jpg',
      '/assets/decks/nature/dog.jpg',
      // ... 18개 이미지
    ],
    thumbnailUrl: '/assets/decks/nature/thumbnail.jpg',
    price: 0,
    isPremium: false,
    isOwned: true,
    releaseDate: '2025-01-01T00:00:00Z',
    tags: ['animals', 'nature', 'free'],
  },
];
```

### 7.2 프리미엄 덱

```typescript
const premiumDecks: Deck[] = [
  {
    id: 'deck-celebrity-001',
    name: 'K-POP 스타',
    description: '인기 K-POP 아이돌',
    category: 'celebrity',
    imageUrls: [/* ... */],
    thumbnailUrl: '/assets/decks/celebrity/thumbnail.jpg',
    price: 5000,
    isPremium: true,
    isOwned: false,
    releaseDate: '2025-02-01T00:00:00Z',
    tags: ['kpop', 'celebrity', 'premium'],
  },
];
```

### 7.3 포인트 패키지

```typescript
const pointsPackages: PointsPackage[] = [
  {
    id: 'points-starter',
    name: '스타터 팩',
    points: 5000,
    price: 5000,
    bonusPercentage: 0,
    isPopular: false,
  },
  {
    id: 'points-popular',
    name: '인기 팩',
    points: 12000,
    price: 10000,
    bonusPercentage: 0.2,
    isPopular: true,
  },
  {
    id: 'points-mega',
    name: '메가 팩',
    points: 30000,
    price: 20000,
    bonusPercentage: 0.5,
    isPopular: false,
  },
];
```
